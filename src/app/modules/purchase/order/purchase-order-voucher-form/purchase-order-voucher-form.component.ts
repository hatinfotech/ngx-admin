import { AdminProductService } from './../../../admin-product/admin-product.service';
import { DynamicListDialogComponent } from './../../../dialog/dynamic-list-dialog/dynamic-list-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel, ProductObjectReferenceModel } from '../../../../models/product.model';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { PurchaseOrderVoucherDetailModel, PurchaseOrderVoucherModel, PurchaseProductModel } from '../../../../models/purchase.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { PurchaseOrderVoucherPrintComponent } from '../purchase-order-voucher-print/purchase-order-voucher-print.component';
import { SmartTableButtonComponent, SmartTableCurrencyComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { CommercePosOrderModel } from '../../../../models/commerce-pos.model';
import * as XLSX from 'xlsx';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
// import { _ } from 'ag-grid-community';
import { BusinessModel } from '../../../../models/accounting.model';
import { FileModel } from '../../../../models/file.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { RootServices } from '../../../../services/root.services';
var CryptoJS = require("crypto-js");

@Component({
  selector: 'ngx-purchase-order-voucher-form',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './purchase-order-voucher-form.component.html',
  styleUrls: ['./purchase-order-voucher-form.component.scss']
})
export class PurchaseOrderVoucherFormComponent extends DataManagerFormComponent<PurchaseOrderVoucherModel> implements OnInit {

  componentName: string = 'PurchaseOrderVoucherFormComponent';
  idKey = 'Code';
  apiPath = '/purchase/order-vouchers';
  baseFormUrl = '/purchase/order-voucher/form';

  env = environment;

  locale = this.cms.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.cms.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.cms.getNumberMaskConfig();

  // locale = this.commo nService.getCurrentLoaleDataset();
  priceCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };
  quantityFormat: CurrencyMaskConfig = { ...this.cms.getNumberMaskConfig(), precision: 2 };

  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (UnitModel & { id?: string, text?: string })[];
  @ViewChild('detailsViewport', { static: false }) detailsViewport: CdkVirtualScrollViewport;

  // select2ContactOption = {
  //   placeholder: 'Chọn liên hệ...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   // multiple: true,
  //   // tags: true,
  //   keyMap: {
  //     id: 'id',
  //     text: 'text',
  //   },
  //   ajax: {
  //     transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
  //       console.log(settings);
  //       const params = settings.data;
  //       this.apiService.getPromise('/contact/contacts', { includeIdText: true, includeGroups: true, filter_Name: params['term'] }).then(rs => {
  //         success(rs);
  //       }).catch(err => {
  //         console.error(err);
  //         failure();
  //       });
  //     },
  //     delay: 300,
  //     processResults: (data: any, params: any) => {
  //       console.info(data, params);
  //       return {
  //         results: data.map(item => {
  //           item['id'] = item['Code'];
  //           item['text'] = item['Code'] + ' - ' + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
  //           return item;
  //         }),
  //       };
  //     },
  //   },
  // };

  uploadConfig = {

  };

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public adminProductService: AdminProductService,
    public ref: NbDialogRef<PurchaseOrderVoucherFormComponent>,
    // public changeDirectorRef: ChangeDetectorRef,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'print',
      status: 'primary',
      label: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.preview(option.form);
      },
    });
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/products', {
      select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures,Groups,Type",
      includeSearchResultLabel: true,
      includeUnits: true,
      sort_SearchRank: 'desc',
      // includeGroups: true,
    }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa/dịch vụ...',
      prepareReaultItem: (item) => {
        item.thumbnail = item?.FeaturePicture?.Thumbnail;
        return item;
      }
    }),
    withThumbnail: true,
    // placeholder: 'Chọn Hàng hoá/dịch vụ...',
    // allowClear: true,
    // width: '100%',
    // dropdownAutoWidth: true,
    // minimumInputLength: 0,
    // withThumbnail: true,
    // keyMap: {
    //   id: 'id',
    //   text: 'text',
    // },
    // ajax: {
    //   transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
    //     console.log(settings);
    //     const params = settings.data;
    //     this.apiService.getPromise('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name=>Name,Sku=>Sku,FeaturePicture=>FeaturePicture,Pictures=>Pictures", includeSearchResultLabel: true, includeUnits: true, 'search': params['term'] }).then(rs => {
    //       success(rs);
    //     }).catch(err => {
    //       console.error(err);
    //       failure();
    //     });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     return {
    //       results: data.map(item => {
    //         item.thumbnail = item?.FeaturePicture?.Thumbnail;
    //         return item;
    //       })
    //     };
    //   },
    // },
  };

  select2OptionForUnit = {
    placeholder: 'Chọn ĐVT...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  select2OptionForTax = {
    placeholder: 'Chọn thuế...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  // Type field option
  select2OptionForType = {
    placeholder: 'Chọn loại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };
  select2DataForType = [
    { id: 'PRODUCT', text: 'Sản phẩm' },
    { id: 'CATEGORY', text: 'Danh mục' },
  ];

  objectControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline',
    title: this.cms.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.cms.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.cms.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.cms.getObjectId(formGroup.get('Object').value);
      this.cms.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          inputId: currentObject ? [currentObject] : null,
          showLoadinng: true,
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Object').patchValue(newContact);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    },
  }];

  contactControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline',
    title: this.cms.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.cms.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.cms.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.cms.getObjectId(formGroup.get('Contact').value);
      this.cms.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          inputId: currentObject ? [currentObject] : null,
          showLoadinng: true,
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Contact').patchValue(newContact);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    },
  }];

  accountingBusinessList: BusinessModel[] = [];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // dropdownCssClass: 'is_tags',
    maximumSelectionLength: 1,
    multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    /** Load and cache tax list */
    this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!PurchaseOrderVoucherFormComponent._taxList) {
    // } else {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList;
    // }

    /** Load and cache unit list */
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!PurchaseOrderVoucherFormComponent._unitList) {
    // } else {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList;
    // }
    this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: 'PURCHASE' }).then(rs => rs.map(accBusiness => {
      accBusiness['id'] = accBusiness.Code;
      accBusiness['text'] = `${accBusiness.Name} (${accBusiness.DebitAccount},${accBusiness.CreditAccount})`;
      return accBusiness;
    }));
    return super.init().then(async status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            // conditonFormGroup.get('Id').setValue('');
          });
        });
      }
      // this.changeDirectorRef.detectChanges();//https://viblo.asia/p/tim-hieu-ve-change-detection-trong-angular-djeZ18EjKWz
      return status;
    });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PurchaseOrderVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeObject'] = true;
    params['includeDetails'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: PurchaseOrderVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PurchaseOrderVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        itemFormData.Details.forEach(detail => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup, details.length - 1);
        });
        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
      }
      // setTimeout(() => {
      //   this.detailsViewport.checkViewportSize();
      // }, 1500);
      this.cms.waitFor(150, 20, async () => !!this.detailsViewport).then(() => this.detailsViewport.checkViewportSize());

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: PurchaseOrderVoucherModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Object: ['', Validators.required],
      ObjectName: ['', Validators.required],
      ObjectEmail: [''],
      ObjectPhone: [''],
      ObjectAddress: [''],
      ObjectIdentifiedNumber: [''],
      Recipient: [''],
      ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      ObjectBankName: [''],
      ObjectBankCode: [''],

      Contact: [],
      ContactName: [],
      ContactPhone: [],
      ContactEmail: [],
      ContactAddress: [],
      ContactIdentifiedNumber: [],

      DateOfReceived: [''],
      DeliveryAddress: [''],
      Title: ['', Validators.required],
      Note: [''],
      SubNote: [''],
      DateOfOrder: [null, Validators.required],
      // RelativeVouchers: [],
      _total: [''],
      RelativeVouchers: [],
      RequireInvoice: [false],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      this.addDetailFormGroup(newForm);
    }
    newForm['_details'] = this.getDetails(newForm);
    newForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      console.log('Form value change: ', value);
    });
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PurchaseOrderVoucherModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/promotion/promotion/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: PurchaseOrderVoucherDetailModel): FormGroup {
    let newForm: FormGroup;
    newForm = this.formBuilder.group({
      // Id: [''],
      SystemUuid: [''],
      No: [''],
      Type: ['PRODUCT'],
      Product: ['', (control: FormControl) => {
        if (newForm && newForm.get('Type').value === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Description: ['', Validators.required],
      Quantity: [1],
      Price: [],
      Unit: ['', (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      // Tax: ['VAT10'],
      ToMoney: [0],
      Image: [[]],
      Reason: [''],
      SupplierSku: [''],
      SupplierProductName: [''],
      ProductTaxName: [''],
      Tax: [''],
      Business: [null, (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }]
    });

    newForm['__type'] = 'PRODUCT';
    if (data) {
      if (data?.Product && Array.isArray(data.Product['Units'])) {
        const unitControl = newForm.get('Unit');
        newForm['UnitList'] = data?.Product['Units'];
      }
      // (async () => {
      newForm.patchValue(data);
      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }
      // await new Promise(resolve => setTimeout(() => resolve(true), 300));
      // this.toMoney(parentFormGroup, newForm, null, );
      // })()
      newForm['__type'] = data["Type"];
    }
    newForm.get('Type').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      newForm['__type'] = this.cms.getObjectId(value);
      // if (newForm['__type'] == 'CATEGORY') {
      newForm.get('Image').setValue([]);
      newForm.get('Product').setValue(null);
      newForm.get('Unit').setValue(null);
      newForm.get('Quantity').setValue(null);
      newForm.get('Price').setValue(null);
      newForm.get('ToMoney').setValue(null);
      newForm.get('Description').setValue(null);
      newForm.get('SupplierSku').setValue(null);
      newForm.get('SupplierProductName').setValue(null);
      newForm.get('ProductTaxName').setValue(null);
      newForm.get('Tax').setValue(null);
      // }
    });
    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    const detailsFormArray = this.getDetails(parentFormGroup);
    detailsFormArray.push(newChildFormGroup);
    const noFormControl = newChildFormGroup.get('No');
    if (!noFormControl.value) {
      noFormControl.setValue(detailsFormArray.length);
    }
    detailsFormArray.controls = [...detailsFormArray.controls];
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup, detailsFormArray.length - 1);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    const details = this.getDetails(parentFormGroup);
    details.removeAt(index);
    details.controls = [...details.controls];
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }

  purchaseProductMap: { [key: string]: PurchaseProductModel } = {};
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup, index: number) {
    newChildFormGroup.get('Quantity').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => this.toMoney(parentFormGroup, newChildFormGroup, 'Quantity', index));
    newChildFormGroup.get('Price').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => this.toMoney(parentFormGroup, newChildFormGroup, 'Price', index));
    newChildFormGroup.get('ToMoney').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => this.toMoney(parentFormGroup, newChildFormGroup, 'ToMoney', index));
    newChildFormGroup.get('Type').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => this.toMoney(parentFormGroup, newChildFormGroup, 'Type', index));
    // Load product name    
    const productControl = newChildFormGroup.get('Product');
    productControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(async value => {

      const productId = this.cms.getObjectId(value);
      const supplierId = this.cms.getObjectId(parentFormGroup.get('Object').value);
      let purchaseProduct = this.purchaseProductMap[productId + '-' + supplierId];
      if (typeof purchaseProduct == 'undefined') {
        purchaseProduct = await this.apiService.getPromise<PurchaseProductModel[]>('/purchase/products/', { eq_Product: productId, eq_Supplier: supplierId, sort_LastUpdate: 'desc' }).then(rs => rs[0]);
        this.purchaseProductMap[productId + '-' + supplierId] = purchaseProduct || null;
      }

      if (purchaseProduct) {
        if (!newChildFormGroup['IsImport'] || !newChildFormGroup.get('SupplierProductName').value) {
          newChildFormGroup.get('SupplierProductName').setValue(purchaseProduct.Name);
        }
        if (!newChildFormGroup['IsImport'] || !newChildFormGroup.get('ProductTaxName').value) {
          newChildFormGroup.get('ProductTaxName').setValue(purchaseProduct.TaxName);
        }
        if (!newChildFormGroup['IsImport'] || !newChildFormGroup.get('SupplierSku').value) {
          newChildFormGroup.get('SupplierSku').setValue(purchaseProduct.Sku);
        }
        if (!newChildFormGroup['IsImport'] || !newChildFormGroup.get('Tax').value) {
          newChildFormGroup.get('Tax').setValue(purchaseProduct.TaxValue);
        }
      }
    });

    const businessControl = newChildFormGroup.get('Business');
    newChildFormGroup.get('Unit').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(async untiConversion => {

      if (productControl.value?.Type == 'PRODUCT') {
        if (untiConversion?.IsAutoAdjustInventory === false) {
          // if(!businessControl.value || businessControl.value.length == 0){
          businessControl.setValue(this.accountingBusinessList.find(f => this.cms.getObjectId(f) == 'PURCHASESKIPWAREHOUSE'));
          // }
        }
        if (untiConversion?.IsAutoAdjustInventory === true) {
          // if(!businessControl.value || businessControl.value.length == 0){
          businessControl.setValue(this.accountingBusinessList.find(f => this.cms.getObjectId(f) == 'PURCHASEWAREHOUSE'));
          // }
        }
      }
      if (productControl.value?.Type == 'SERVICE') {
        businessControl.setValue(this.accountingBusinessList.find(f => this.cms.getObjectId(f) == 'PURCHASECOST'));
      }
    });
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }

  /**
   * Choose product form recent purchase order and add to details
   * @param parentFormGroup 
   * @returns 
   */
  addMultiProducts(parentFormGroup: FormGroup) {

    const filter = { group_Object: true, group_Product: true, includeUnit: true };
    const objectId = this.cms.getObjectId(parentFormGroup.get('Object').value);
    if (objectId) {
      filter['eq_Object'] = objectId;
      filter['sort_DateOfOrder'] = 'desc';
    }

    this.cms.openDialog(DynamicListDialogComponent, {
      context: {
        inputMode: 'dialog',
        choosedMode: true,
        onDialogChoose: async (choosedItems: PurchaseOrderVoucherDetailModel[]) => {
          console.log(choosedItems);
          const productIds = choosedItems.map(m => m.Product);
          const productList = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Code: '[' + productIds.join(',') + ']', select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", includeSearchResultLabel: true, includeUnits: true });
          const details = this.getDetails(parentFormGroup);
          for (const product of productList) {
            const chooseItem = choosedItems.find(f => f.Product as any == product.Code);
            const newDetailFormGroup = this.makeNewDetailFormGroup(parentFormGroup, {
              Product: product as any,
              Price: chooseItem?.Price,
              Quantity: chooseItem?.Quantity,
              Image: chooseItem?.Image
            });
            newDetailFormGroup['UnitList'] = product.Units;
            details.push(newDetailFormGroup);
            newDetailFormGroup.get('Unit').setValue(product.Units.find(f => f['DefaultImport']));
            this.onAddDetailFormGroup(parentFormGroup, newDetailFormGroup, details.length - 1);
          }
          this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          // this.changeDirectorRef.detectChanges();
        },
        title: 'Danh sách hàng hóa đã đặt hàng nhà cung cấp ' + parentFormGroup.get('ObjectName').value,
        apiPath: '/purchase/order-voucher-details',
        idKey: ['Product'],
        params: filter,
        // actionButtonList: [],
        listSettings: {
          // pager: {
          //   display: true,
          //   perPage: 10,
          // },
          actions: false,
          columns: {
            // No: {
            //   title: 'No.',
            //   type: 'string',
            //   width: '5%',
            //   filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
            // },
            Order: {
              title: this.cms.textTransform(this.cms.translate.instant('Common.voucher'), 'head-title'),
              type: 'text',
              renderComponent: SmartTableTagsComponent,
              // onComponentInitFunction: (instance: SmartTableTagsComponent) => {
              //   instance.click.subscribe((voucher: string) => this.cms.previewVoucher('CLBRTORDER', voucher));
              // },
              width: '10%',
              // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
              // valuePrepareFunction: (cell: string, row: any) => {
              //   return [{ id: cell, text: cell }] as any;
              // },
            },
            Product: {
              title: this.cms.textTransform(this.cms.translate.instant('Common.product'), 'head-title'),
              type: 'string',
              width: '10%',
              filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
            },
            Description: {
              title: this.cms.textTransform(this.cms.translate.instant('Common.description'), 'head-title'),
              type: 'string',
              width: '40%',
              filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
            },
            Unit: {
              title: this.cms.textTransform(this.cms.translate.instant('Product.unit'), 'head-title'),
              type: 'string',
              width: '10%',
              filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
              valuePrepareFunction: (cell, row) => {
                return this.cms.getObjectText(cell);
              }
            },
            Quantity: {
              title: this.cms.textTransform(this.cms.translate.instant('Common.quantity'), 'head-title'),
              type: 'string',
              width: '10%',
              filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
            },
            Price: {
              title: this.cms.textTransform(this.cms.translate.instant('Common.price'), 'head-title'),
              type: 'custom',
              class: 'align-right',
              width: '10%',
              position: 'right',
              renderComponent: SmartTableCurrencyComponent,
              onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
                // instance.format$.next('medium');
                instance.style = 'text-align: right';
              },
            },
            ToMoney: {
              title: this.cms.textTransform(this.cms.translate.instant('Common.numOfMoney'), 'head-title'),
              type: 'custom',
              class: 'align-right',
              width: '10%',
              position: 'right',
              renderComponent: SmartTableCurrencyComponent,
              onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
                // instance.format$.next('medium');
                instance.style = 'text-align: right';
              },
              valuePrepareFunction: (cell: string, row: PurchaseOrderVoucherDetailModel) => {
                return `${row.Quantity * row.Price}`;
              },
            },
            Preview: {
              title: this.cms.translateText('Common.show'),
              type: 'custom',
              width: '5%',
              class: 'align-right',
              renderComponent: SmartTableButtonComponent,
              onComponentInitFunction: (instance: SmartTableButtonComponent) => {
                instance.iconPack = 'eva';
                instance.icon = 'external-link-outline';
                instance.display = true;
                instance.status = 'primary';
                instance.style = 'text-align: right';
                instance.class = 'align-right';
                instance.title = this.cms.translateText('Common.preview');
                instance.valueChange.subscribe(value => {
                  // instance.icon = value ? 'unlock' : 'lock';
                  // instance.status = value === 'REQUEST' ? 'warning' : 'success';
                  // instance.disabled = value !== 'REQUEST';
                });
                instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PurchaseOrderVoucherDetailModel) => {
                  this.cms.previewVoucher('PURCHASEORDER', rowData.Order);
                });
              },
            }
          }
        }
      },
    });

    return false;
  }
  /** End Detail Form */

  /** Action Form */
  makeNewActionFormGroup(data?: PromotionActionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: ['', Validators.required],
      Product: [''],
      Amount: [''],
      // Discount: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getActions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Actions') as FormArray;
  }
  addActionFormGroup(formGroupIndex: number) {
    const newFormGroup = this.makeNewActionFormGroup();
    this.getActions(formGroupIndex).push(newFormGroup);
    this.onAddActionFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeActionGroup(formGroupIndex: number, index: number) {
    this.getActions(formGroupIndex).removeAt(index);
    this.onRemoveActionFormGroup(formGroupIndex, index);
    return false;
  }
  onAddActionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  }
  onRemoveActionFormGroup(mainIndex: number, index: number) {
  }
  /** End Action Form */

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        if (selectedData.Code) {
          formGroup.get('ObjectName').setValue(selectedData.Name);
          formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          formGroup.get('ObjectEmail').setValue(selectedData.Email);
          formGroup.get('ObjectAddress').setValue(selectedData.Address);
          formGroup.get('ObjectTaxCode').setValue(selectedData.TaxCode);
          formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }
  }

  onContactChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        if (selectedData.Code) {
          formGroup.get('ContactName').setValue(selectedData.Name);
          formGroup.get('ContactPhone').setValue(selectedData.Phone);
          formGroup.get('ContactEmail').setValue(selectedData.Email);
          formGroup.get('ContactAddress').setValue(selectedData.Address);
        }
      }
    }
  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel, parentForm: FormGroup) {
    console.log(selectedData);
    if (!this.isProcessing) {
      if (selectedData) {
        // if (!detail['IsImport'] || !detail.get('Description').value) {
        detail.get('Description').setValue(selectedData.Name);
        // }
        if (selectedData.Units) {
          const unitControl = detail.get('Unit');
          detail['UnitList'] = selectedData.Units;
          unitControl.patchValue(selectedData.Units.find(f => f['DefaultImport'] === true), { emitEvent: false });
        }
        if (selectedData.Pictures && selectedData.Pictures.length > 0) {
          detail.get('Image').setValue(selectedData.Pictures, { emitEvent: false });
        } else {
          detail.get('Image').setValue([], { emitEvent: false });
        }
      } else {
        // if (!detail['IsImport'] || !detail.get('Description').value) {
        detail.get('Description').setValue('', { emitEvent: false });
        // }
        detail.get('Unit').setValue('', { emitEvent: false });
      }
    }
    return false;
  }

  calculatToMoney(detail: FormGroup, source?: string) {
    if (source === 'ToMoney') {
      const price = detail.get('ToMoney').value / detail.get('Quantity').value;
      return price;
    } else {
      const toMoney = detail.get('Quantity').value * detail.get('Price').value;
      return toMoney;
    }
  }

  toMoney(formItem: FormGroup, detail: FormGroup, source?: string, index?: number) {
    this.cms.takeUntil(this.componentName + '_ToMoney_ ' + index, 300).then(() => {
      if (source === 'ToMoney') {
        detail.get('Price').setValue(this.calculatToMoney(detail, source), { emitEvent: false });
      } else {
        detail.get('ToMoney').setValue(this.calculatToMoney(detail), { emitEvent: false });
      }
      // Call culate total
      const details = this.getDetails(formItem);
      let total = 0;
      for (let i = 0; i < details.controls.length; i++) {
        total += this.calculatToMoney(details.controls[i] as FormGroup);
      }
      formItem.get('_total').setValue(total);
    });
    return false;
  }


  async preview(formItem: FormGroup) {
    const data: PurchaseOrderVoucherModel = formItem.value;
    this.cms.openDialog(PurchaseOrderVoucherPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: [data],
        idKey: ['Code'],
        onSaveAndClose: (priceReport: PurchaseOrderVoucherModel) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (priceReport: PurchaseOrderVoucherModel) => {
          this.save();
        },
      },
    });
    return false;
  }

  getRawFormData() {
    return super.getRawFormData();
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.cms.previewVoucher(this.cms.getObjectId(relativeVocher.type), relativeVocher);
    return false;
  }

  customIcons: { [key: string]: CustomIcon[] } = {};
  getCustomIcons(name: string): CustomIcon[] {
    if (this.customIcons[name]) return this.customIcons[name];
    return this.customIcons[name] = [{
      icon: 'plus-square-outline',
      title: this.cms.translateText('Common.addNewProduct'),
      status: 'success',
      states: {
        '<>': {
          icon: 'edit-outline',
          status: 'primary',
          title: this.cms.translateText('Common.editProduct'),
        },
        '': {
          icon: 'plus-square-outline',
          status: 'success',
          title: this.cms.translateText('Common.addNewProduct'),
        },
      },
      action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
        const currentProduct = this.cms.getObjectId(formGroup.get('Product').value);
        this.cms.openDialog(ProductFormComponent, {
          context: {
            inputMode: 'dialog',
            inputId: currentProduct ? [currentProduct] : null,
            showLoadinng: true,
            onDialogSave: (newData: ProductModel[]) => {
              console.log(newData);
              // const formItem = formGroupComponent.formGroup;
              const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.cms.getObjectId(unit?.Unit), text: this.cms.getObjectText(unit?.Unit) })) };
              formGroup.get('Product').patchValue(newProduct);
            },
            onDialogClose: () => {

            },
          },
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }];
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.cms.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'COMMERCEPOSORDER': { title: 'Đơn hàng POS' },
          'SALES': { title: 'Phiếu bán hàng' },
          'PRICEREPORT': { title: 'Phiếu báo giá' },
        },
        // inputMode: 'dialog',
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'COMMERCEPOSORDER') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + chooseItems[i].Code, { includeContact: true, includeObject: true, includeDetails: true, includeRelativeVouchers: true, includeUnit: true }).then(rs => rs[0]);

                if (['PRICEREPORT'].indexOf(this.cms.getObjectId(voucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Đơn đặt POS chưa được báo giá'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                delete voucher.Id;
                formGroup.patchValue({ ...voucher, Code: null, Id: null, Object: null, ObjectName: null, ObjectPhone: null, PbjectAddress: null, ObjectIdentifiedNumber: null, Details: [] });
                details.clear();
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Đơn đặt hàng POS: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Price: null, RelateDetail: `COMMERCEPOSORDER/${voucher.Code}/${voucherDetail.SystemUuid}` });
                      details.push(newDetailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'COMMERCEPOSORDER', typeMap: this.cms.voucherTypeMap['COMMERCEPOSORDER'] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }

          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
      }
    })
    return false;
  }

  exportDetails(formItem: FormGroup) {
    const data = this.getRawFormData();
    const details = [];
    let no = 0;
    for (const detail of data.array[0].Details) {
      no++;
      details.push({
        STT: no,
        Sku: detail['Product']['Sku'],
        Product: this.cms.getObjectId(detail['Product']),
        ProductName: detail['Description'],
        ProductTaxName: detail['ProductTaxName'],
        Tax: detail['Tax'],
        Unit: this.cms.getObjectId(detail['Unit']),
        UnitName: this.cms.getObjectText(detail['Unit']),
        Price: detail['Price'],
        Quantity: detail['Quantity'],
        ToMoney: detail['ToMoney'],
      });
    }
    const sheet = XLSX.utils.json_to_sheet(details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Chi tiết đơn đặt mua hàng');
    XLSX.writeFile(workbook, 'DDMH-' + data.array[0].Code + ' - ' + data.array[0].Title + ' - NCC: ' + this.cms.getObjectId(data.array[0].Object) + ' - ' + data.array[0].ObjectName + '.xlsx');

  }

  fileName: string;
  importDetails(formItem: FormGroup, ev: any) {
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (!file) return;
    this.fileName = file.name;
    reader.onload = async (event) => {
      try {
        this.isProcessing = true;
        let chooseSheet = null;
        const data = reader.result;
        const workBook = XLSX.read(data, { type: 'binary' });
        let sheet = null;
        const jsonData = workBook.SheetNames.reduce((initial, name) => {
          sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.onProcessing();

        const sheets = Object.keys(jsonData);
        if (sheets.length > 1) {
          sheet = await new Promise((resove, reject) => {
            this.cms.openDialog(DialogFormComponent, {
              context: {
                cardStyle: { width: '500px' },
                title: 'File excel có nhiều hơn 1 sheet, mời bạn chọn sheet cần import',
                onInit: async (form, dialog) => {
                  return true;
                },
                onClose: async (form, dialog) => {
                  // ev.target.
                  return true;
                },
                controls: [
                  {
                    name: 'Sheet',
                    label: 'Sheet',
                    placeholder: 'Chọn sheet...',
                    type: 'select2',
                    initValue: sheets[0],
                    // focus: true,
                    option: {
                      data: sheets.map(m => ({ id: m, text: m })),
                      placeholder: 'Chọn sheet...',
                      allowClear: true,
                      width: '100%',
                      dropdownAutoWidth: true,
                      minimumInputLength: 0,
                      withThumbnail: false,
                      keyMap: {
                        id: 'id',
                        text: 'text',
                      },
                    }
                  },
                ],
                actions: [
                  {
                    label: 'Esc - Trở về',
                    icon: 'back',
                    status: 'basic',
                    keyShortcut: 'Escape',
                    action: async () => { return true; },
                  },
                  {
                    label: 'Chọn',
                    icon: 'generate',
                    status: 'success',
                    // keyShortcut: 'Enter',
                    action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

                      console.log(form.value);
                      chooseSheet = this.cms.getObjectId(form.get('Sheet').value);
                      resove(jsonData[chooseSheet]);

                      return true;
                    },
                  },
                ],
              },
              closeOnEsc: false,
              closeOnBackdropClick: false,
            });

          });
        } else {
          sheet = jsonData[sheets[0]];
          chooseSheet = sheets[0];
        }

        // Confirm mapping
        const tmpSheet: string[][] = XLSX.utils.sheet_to_json(workBook.Sheets[chooseSheet], { header: 1 });
        const columnList = tmpSheet[0].map((m: string) => {
          const id = m.split('/')[0];
          const text = m;
          return { id, text };
        });

        // Auto mapping
        const details = this.getDetails(formItem);
        if (details.controls.length != sheet.length) {
          this.cms.showToast('Số dòng trên file excel không khớp với số dòng trên đơn đặt hàng!', 'Không khớp số dòng!', { duration: 60000, status: 'warning' });
        }

        for (const row of sheet) {
          for (const colName in row) {
            const logicColName = colName.split('/')[0];
            row[logicColName] = row[colName];
          }
          let detailForm: FormGroup = null;
          if (row['Sku']) {
            detailForm = details.controls.find(f => f.get('Product')?.value?.Sku == row['Sku']) as FormGroup;
            // if (detailForm) {
            //   if (row['SupplierSku']) detailForm.get('SupplierSku').setValue(row['SupplierSku']);
            //   if (row['SupplierProductName']) detailForm.get('SupplierProductName').setValue(row['SupplierProductName']);
            //   if (row['SupplierProductTaxName']) detailForm.get('ProductTaxName').setValue(row['SupplierProductTaxName']);
            //   if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            //   if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // }
          } else if (row['SupplierSku']) {
            detailForm = details.controls.find(f => f.get('SupplierSku')?.value == row['SupplierSku']) as FormGroup;
            // if (detailForm) {
            //   if (row['SupplierProductName']) detailForm.get('SupplierProductName').setValue(row['SupplierProductName']);
            //   if (row['SupplierProductTaxName']) detailForm.get('ProductTaxName').setValue(row['SupplierProductTaxName']);
            //   if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            //   if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // }
          } else if (row['SupplierProductName']) {// Load product by product name map by supplier
            detailForm = details.controls.find(f => f.get('SupplierProductName')?.value == row['SupplierProductName']) as FormGroup;
            // if (detailForm) {
            //   if (row['ProductTaxName']) detailForm.get('ProductTaxName').setValue(row['SupplierProductTaxName']);
            //   if (row['SupplierSku']) detailForm.get('SupplierSku').setValue(row['SupplierSku']);
            //   if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            //   if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // }
          } else if (row['SupplierProductTaxName']) {// Load product by product name map by supplier
            detailForm = details.controls.find(f => f.get('ProductTaxName')?.value == row['SupplierProductTaxName']) as FormGroup;
            // if (detailForm) {
            //   if (row['SupplierProductName']) detailForm.get('SupplierProductName').setValue(row['SupplierProductName']);
            //   if (row['SupplierSku']) detailForm.get('SupplierSku').setValue(row['SupplierSku']);
            //   if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            //   if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // }
          }
          if (detailForm) {
            if (row['SupplierSku']) detailForm.get('SupplierSku').setValue(row['SupplierSku']);
            if (row['SupplierProductName']) detailForm.get('SupplierProductName').setValue(row['SupplierProductName']);
            if (row['SupplierProductTaxName']) detailForm.get('ProductTaxName').setValue(row['SupplierProductTaxName']);
            if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // this.toMoney(formItem, detailForm);
          }

          // let unit = null;
          // if (row['Unit']) {
          //   unit = this.adminProductService.unitMap$?.value[row['Unit']?.trim()];
          // }
          // if (!unit && product) {
          //   unit = product.UnitConversions?.find(f => f.Name == row['UnitName']?.trim());
          // }

          if (!detailForm) {
            this.cms.showToast(row['ProductName'] + ' Không có trên đơn đặt hàng', 'Sản phẩm không có trên đơn đặt hàng !', { duration: 15000, status: 'warning', duplicatesBehaviour: 'previous', limit: 1 });
          } else {
            detailForm['IsImport'] = true;
          }
        }

        this.onProcessed();
        this.cms.showToast('Nhập chi tiết từ thành công', 'Hệ thống đã nhập các thông tin chi tiết trên file excel vào chi tiết tương ứng trên phiếu !', { duration: 15000, status: 'success' });
        return true;
      } catch (err) {
        console.error(err);
        this.onProcessed();
        this.cms.showToast(err, 'Có lỗi xảy ra trong quá trình nhập chi tiết!', { duration: 15000, status: 'danger', duplicatesBehaviour: 'previous', limit: 1 });
      }
    };
    reader.readAsBinaryString(file);
  }

  chooseFileAndFillDetails(formItem: FormGroup, ev: any) {
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (!file) return;
    this.fileName = file.name;
    reader.onload = async (event) => {
      try {
        this.isProcessing = true;
        let chooseSheet = null;
        const data = reader.result;
        const workBook = XLSX.read(data, { type: 'binary' });
        let sheet = null;
        const jsonData = workBook.SheetNames.reduce((initial, name) => {
          sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.onProcessing();

        const sheets = Object.keys(jsonData);
        if (sheets.length > 1) {
          sheet = await new Promise((resove, reject) => {
            this.cms.openDialog(DialogFormComponent, {
              context: {
                cardStyle: { width: '500px' },
                title: 'File excel có nhiều hơn 1 sheet, mời bạn chọn sheet cần import',
                onInit: async (form, dialog) => {
                  return true;
                },
                onClose: async (form, dialog) => {
                  // ev.target.
                  return true;
                },
                controls: [
                  {
                    name: 'Sheet',
                    label: 'Sheet',
                    placeholder: 'Chọn sheet...',
                    type: 'select2',
                    initValue: sheets[0],
                    // focus: true,
                    option: {
                      data: sheets.map(m => ({ id: m, text: m })),
                      placeholder: 'Chọn sheet...',
                      allowClear: true,
                      width: '100%',
                      dropdownAutoWidth: true,
                      minimumInputLength: 0,
                      withThumbnail: false,
                      keyMap: {
                        id: 'id',
                        text: 'text',
                      },
                    }
                  },
                ],
                actions: [
                  {
                    label: 'Esc - Trở về',
                    icon: 'back',
                    status: 'basic',
                    keyShortcut: 'Escape',
                    action: async () => { return true; },
                  },
                  {
                    label: 'Chọn',
                    icon: 'generate',
                    status: 'success',
                    // keyShortcut: 'Enter',
                    action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

                      console.log(form.value);
                      chooseSheet = this.cms.getObjectId(form.get('Sheet').value);
                      resove(jsonData[chooseSheet]);

                      return true;
                    },
                  },
                ],
              },
              closeOnEsc: false,
              closeOnBackdropClick: false,
            });

          });
        } else {
          sheet = jsonData[sheets[0]];
          chooseSheet = sheets[0];
        }

        // Confirm mapping
        const tmpSheet: string[][] = XLSX.utils.sheet_to_json(workBook.Sheets[chooseSheet], { header: 1 });
        const columnList = tmpSheet[0].map((m: string) => {
          const id = m.split('/')[0];
          const text = m;
          return { id, text };
        });

        // Auto mapping
        const details = this.getDetails(formItem);
        if (details.controls.length != sheet.length) {
          this.cms.showToast('Số dòng trên file excel không khớp với số dòng trên đơn đặt hàng!', 'Không khớp số dòng!', { duration: 60000, status: 'warning' });
        }

        for (const row of sheet) {
          for (const colName in row) {
            const logicColName = colName.split('/')[0];
            row[logicColName] = row[colName];
          }
          let detailForm: FormGroup = null;
          if (row['Sku']) {
            detailForm = details.controls.find(f => f.get('Product')?.value?.Sku == row['Sku']) as FormGroup;
            // if (detailForm) {
            //   if (row['SupplierSku']) detailForm.get('SupplierSku').setValue(row['SupplierSku']);
            //   if (row['SupplierProductName']) detailForm.get('SupplierProductName').setValue(row['SupplierProductName']);
            //   if (row['SupplierProductTaxName']) detailForm.get('ProductTaxName').setValue(row['SupplierProductTaxName']);
            //   if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            //   if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // }
          } else if (row['SupplierSku']) {
            detailForm = details.controls.find(f => f.get('SupplierSku')?.value == row['SupplierSku']) as FormGroup;
            // if (detailForm) {
            //   if (row['SupplierProductName']) detailForm.get('SupplierProductName').setValue(row['SupplierProductName']);
            //   if (row['SupplierProductTaxName']) detailForm.get('ProductTaxName').setValue(row['SupplierProductTaxName']);
            //   if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            //   if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // }
          } else if (row['SupplierProductName']) {// Load product by product name map by supplier
            detailForm = details.controls.find(f => f.get('SupplierProductName')?.value == row['SupplierProductName']) as FormGroup;
            // if (detailForm) {
            //   if (row['ProductTaxName']) detailForm.get('ProductTaxName').setValue(row['SupplierProductTaxName']);
            //   if (row['SupplierSku']) detailForm.get('SupplierSku').setValue(row['SupplierSku']);
            //   if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            //   if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // }
          } else if (row['SupplierProductTaxName']) {// Load product by product name map by supplier
            detailForm = details.controls.find(f => f.get('ProductTaxName')?.value == row['SupplierProductTaxName']) as FormGroup;
            // if (detailForm) {
            //   if (row['SupplierProductName']) detailForm.get('SupplierProductName').setValue(row['SupplierProductName']);
            //   if (row['SupplierSku']) detailForm.get('SupplierSku').setValue(row['SupplierSku']);
            //   if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            //   if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // }
          }
          if (detailForm) {
            if (row['SupplierSku']) detailForm.get('SupplierSku').setValue(row['SupplierSku']);
            if (row['SupplierProductName']) detailForm.get('SupplierProductName').setValue(row['SupplierProductName']);
            if (row['SupplierProductTaxName']) detailForm.get('ProductTaxName').setValue(row['SupplierProductTaxName']);
            if (row['SupplierTax']) detailForm.get('Tax').setValue(row['SupplierTax']);
            if (row['Price']) detailForm.get('Price').setValue(row['Price']);
            // this.toMoney(formItem, detailForm);
          }

          // let unit = null;
          // if (row['Unit']) {
          //   unit = this.adminProductService.unitMap$?.value[row['Unit']?.trim()];
          // }
          // if (!unit && product) {
          //   unit = product.UnitConversions?.find(f => f.Name == row['UnitName']?.trim());
          // }

          if (!detailForm) {
            this.cms.showToast(row['ProductName'] + ' Không có trên đơn đặt hàng', 'Sản phẩm không có trên đơn đặt hàng !', { duration: 15000, status: 'warning', duplicatesBehaviour: 'previous', limit: 1 });
          } else {
            detailForm['IsImport'] = true;
          }
        }

        this.onProcessed();
        this.cms.showToast('Nhập chi tiết từ thành công', 'Hệ thống đã nhập các thông tin chi tiết trên file excel vào chi tiết tương ứng trên phiếu !', { duration: 15000, status: 'success' });
        return true;
      } catch (err) {
        console.error(err);
        this.onProcessed();
        this.cms.showToast(err, 'Có lỗi xảy ra trong quá trình nhập chi tiết!', { duration: 15000, status: 'danger', duplicatesBehaviour: 'previous', limit: 1 });
      }
    };
    reader.readAsBinaryString(file);
  }

  chooseFileAndImportDetails(formItem: FormGroup, ev: any) {
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (!file) return;
    this.fileName = file.name;
    reader.onload = async (event) => {
      try {
        // this.isProcessing = true;
        let chooseSheet = null;
        const data = reader.result;
        const workBook = XLSX.read(data, { type: 'binary' });
        let sheet = null;
        const jsonData = workBook.SheetNames.reduce((initial, name) => {
          sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.onProcessing();

        const sheets = Object.keys(jsonData);
        if (sheets.length > 1) {
          sheet = await new Promise((resove, reject) => {
            this.cms.openDialog(DialogFormComponent, {
              context: {
                cardStyle: { width: '500px' },
                title: 'File excel có nhiều hơn 1 sheet, mời bạn chọn sheet cần import',
                onInit: async (form, dialog) => {
                  return true;
                },
                onClose: async (form, dialog) => {
                  // ev.target.
                  return true;
                },
                controls: [
                  {
                    name: 'Sheet',
                    label: 'Sheet',
                    placeholder: 'Chọn sheet...',
                    type: 'select2',
                    initValue: sheets[0],
                    // focus: true,
                    option: {
                      data: sheets.map(m => ({ id: m, text: m })),
                      placeholder: 'Chọn sheet...',
                      allowClear: true,
                      width: '100%',
                      dropdownAutoWidth: true,
                      minimumInputLength: 0,
                      withThumbnail: false,
                      keyMap: {
                        id: 'id',
                        text: 'text',
                      },
                    }
                  },
                ],
                actions: [
                  {
                    label: 'Esc - Trở về',
                    icon: 'back',
                    status: 'basic',
                    keyShortcut: 'Escape',
                    action: async () => { return true; },
                  },
                  {
                    label: 'Chọn',
                    icon: 'generate',
                    status: 'success',
                    // keyShortcut: 'Enter',
                    action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

                      console.log(form.value);
                      chooseSheet = this.cms.getObjectId(form.get('Sheet').value);
                      resove(jsonData[chooseSheet]);

                      return true;
                    },
                  },
                ],
              },
              closeOnEsc: false,
              closeOnBackdropClick: false,
            });

          });
        } else {
          sheet = jsonData[sheets[0]];
          chooseSheet = sheets[0];
        }

        // Confirm mapping
        const tmpSheet: string[][] = XLSX.utils.sheet_to_json(workBook.Sheets[chooseSheet], { header: 1 });
        const columnList = tmpSheet[0].map((m: string) => {
          const id = m.split('/')[0];
          const text = m;
          return { id, text };
        });

        // Auto mapping
        const details = this.getDetails(formItem);
        // if (details.controls.length != sheet.length) {
        //   this.cms.showToast('Số dòng trên file excel không khớp với số dòng trên đơn đặt hàng!', 'Không khớp số dòng!', { duration: 60000, status: 'warning' });
        // }


        details.clear();
        const skus = [];
        for (const row of sheet) {
          for (const colName in row) {
            const logicColName = colName.split('/')[0];
            row[logicColName] = row[colName];
          }

          row.SupplierSku = row.Sku;
          row.SupplierProductName = row.ProductName;

          if (row.CustomerSku) {
            skus.push(row.CustomerSku);
          }
          if (row.Sku) {
            skus.push(row.Sku);
          }
        }

        // Load products info by sku
        const products = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Sku: '[' + skus.join(',') + ']', includeIdText: true, limit: 'nolimit' });
        const productMap: { [key: string]: ProductModel } = {};
        const productPictureMap: { [key: string]: FileModel } = {};
        for (const product of products) {
          productMap[product.Sku] = product;
        }

        for (const row of sheet) {
          if (!row.ProductName) {
            continue;
          }
          let localProduct = row.CustomerSku && productMap[row.CustomerSku] || null;
          if (!localProduct) {
            const purchaseProduct = await this.apiService.getPromise<PurchaseProductModel[]>('/purchase/products', { eq_Sku: row.Sku, eq_Supplier: this.cms.getObjectId(formItem.get('Object').value), sort_LastUpdate: 'desc' }).then(rs => rs[0]);
            if (purchaseProduct) {
              localProduct = await this.apiService.getPromise<ProductModel[]>('/admin-product/products/' + purchaseProduct.Product, { includeIdText: true }).then(rs => rs[0]);
            }
          }
          if (!localProduct) {
            // Confirm create new product
            try {
              localProduct = await new Promise((resolve, reject) => {
                this.cms.showDialog('Chưa có thông tin sản phẩm', `Bạn có muốn tạo mới sản phẩm ${row.ProductName}, sản phẩm mới sau khi tạo sẽ tự động thêm vào chi tiết phiếu đặt mua hàng.`, [
                  {
                    label: 'Không',
                    status: 'basic',
                    action: () => {
                      resolve(null);
                    },
                  },
                  {
                    label: 'Tạo mới',
                    status: 'primary',
                    action: async (button, dialog) => {
                      dialog.loading = true;
                      // load exists product
                      const requestSku = row.CustomerSku || row.Sku;
                      let existsProduct: ProductModel = null;
                      // let existsPicturesMap: { [key: string]: FileModel } = {};
                      // let newPictures: FileModel[] = [];
                      if (requestSku) {
                        existsProduct = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Sku: requestSku, includeIdText: true, includePictures: true, includeCategories: true, includeGroups: true, includeUnitConversions: true, includeProperties: true, includeWarehouseUnit: true }).then(rs => rs[0]);
                        // existsPictures = existsProduct.Pictures || [];
                        // for(const existsPicture of existsPictures) {
                        //   if(imageResources)
                        // }
                        if (existsProduct?.Pictures) {
                          for (const existsPicture of existsProduct.Pictures) {
                            if (existsPicture.Tag) {
                              // existsPicturesMap[existsPicture.Tag] = existsPicture;
                              productPictureMap[existsPicture.Tag] = existsPicture;
                            }
                          }
                        }
                      }

                      // create images
                      const imageResources: FileModel[] = [];
                      if (row.Image) {
                        const imageLinks = row.Image.split('\n');
                        for (const imageLink of imageLinks) {
                          const tag = CryptoJS.MD5(imageLink).toString();
                          if (productPictureMap[tag]) {
                            imageResources.push(productPictureMap[tag]);
                          } else {
                            const image = await this.apiService.uploadFileByLink(imageLink);
                            if (image) {
                              image.Tag = tag;
                              imageResources.push(image);
                              productPictureMap[tag] = image;
                            }
                          }
                        }
                      }

                      this.cms.openDialog(ProductFormComponent, {
                        context: {
                          inputId: existsProduct?.Code ? [existsProduct?.Code] : null,
                          data: [
                            {
                              Code: existsProduct?.Code || null,
                              Name: row.ProductName,
                              Sku: row.CustomerSku || row.Sku,
                              WarehouseUnit: { id: row.Unit, text: row.UnitName } as any,
                              UnitConversions: [
                                {
                                  Unit: { id: row.Unit, text: row.UnitName } as any,
                                  ConversionRatio: 1,
                                  IsDefaultSales: true,
                                  IsDefaultPurchase: true,
                                  Name: row.UnitName
                                }
                              ],
                              FeaturePicture: imageResources[0] || null,
                              Pictures: imageResources,
                            }
                          ],
                          onDialogSave(newData) {
                            this.cms.showToast('Đã tạo sản phẩm mới và thêm vào chi tiết đơn đặt mua hàng', 'Đã tạo sản phẩm mới', { status: 'info' });
                            resolve({ id: newData[0].Code, text: newData[0].Name, ...newData[0] });
                          },
                          onDialogClose: () => {
                            resolve(null);
                          },
                          onDialogError: async (component, err) => {
                            console.log(err);
                            if (err.error?.errorCode == 1062) {
                              const sku = component.getRawFormData().array[0].Sku;
                              if (sku) {
                                component.close();
                                this.cms.showToast('Sku đã tồn tại, tự động lấy thông tin sản phẩm theo Sku', 'Sku đã tồn tại', { status: 'info' });
                                localProduct = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { eq_Sku: sku, includeIdText: true, includePictures: true, includeCategories: true, includeGroups: true, includeUnitConversions: true, includeProperties: true, includeWarehouseUnit: true }).then(rs => rs[0]);
                                resolve(localProduct);
                                // return Promise.resolve(null);
                              }
                            }
                          }
                        }
                      });

                      dialog.loading = false;
                    },
                  },
                  {
                    label: 'Dừng',
                    status: 'danger',
                    action: () => {
                      reject('STOP')
                    },
                  },
                ],
                  (asCase) => {
                    // Close by ESC
                    if (asCase == 'default') {
                      resolve(null);
                    }
                    if (asCase == 'close') {
                      resolve(null);
                    }
                  });
              });
            } catch (err) {
              console.error(err);
              if (err == 'STOP') {
                break;
              }
            }
          }
          if (localProduct) {
            row.Product = localProduct;
            row.Unit = { id: row.Unit, text: row.UnitName };
            row.Description = localProduct.Name;
            row.Image = localProduct.Pictures;
            let detailForm: FormGroup = this.makeNewDetailFormGroup(formItem, row);
            details.push(detailForm);
            this.onAddDetailFormGroup(formItem, detailForm, details.length - 1);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
        }

        this.onProcessed();
        this.cms.showToast('Nhập chi tiết từ thành công', 'Hệ thống đã nhập các thông tin chi tiết trên file excel vào chi tiết tương ứng trên phiếu !', { duration: 15000, status: 'success' });
        return true;
      } catch (err) {
        console.error(err);
        this.onProcessed();
        this.cms.showToast(err, 'Có lỗi xảy ra trong quá trình nhập chi tiết!', { duration: 15000, status: 'danger', duplicatesBehaviour: 'previous', limit: 1 });
      }
    };
    reader.readAsBinaryString(file);
  }

  addDetailAfter(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    const formDetails = this.getDetails(parentFormGroup);
    const newDetailFormGroup = this.makeNewDetailFormGroup(parentFormGroup, { Type: 'CATEGORY' });
    formDetails.controls.splice(index + 1, 0, newDetailFormGroup);
  }

}
