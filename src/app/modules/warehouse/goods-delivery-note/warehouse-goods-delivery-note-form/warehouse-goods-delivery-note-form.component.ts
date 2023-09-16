import { WpOrderModel } from './../../../../models/wordpress.model';
import { SystemConfigModel } from './../../../../models/model';
import { DeploymentVoucherModel } from './../../../../models/deployment.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { filter, pairwise, startWith, take, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { BusinessModel } from '../../../../models/accounting.model';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel, ProductUnitConversoinModel, ProductUnitModel } from '../../../../models/product.model';
import { SalesVoucherModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { GoodsModel, WarehouseGoodsContainerModel, WarehouseGoodsDeliveryNoteDetailModel, WarehouseGoodsDeliveryNoteModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
// import { PurchaseOrderVoucherFormComponent } from '../../../purchase/order/purchase-order-voucher-form/purchase-order-voucher-form.component';
import { SalesVoucherListComponent } from '../../../sales/sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { SalesVoucherPrintComponent } from '../../../sales/sales-voucher/sales-voucher-print/sales-voucher-print.component';
import { WarehouseGoodsDeliveryNotePrintComponent } from '../warehouse-goods-delivery-note-print/warehouse-goods-delivery-note-print.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'ngx-warehouse-goods-delivery-note-form',
  templateUrl: './warehouse-goods-delivery-note-form.component.html',
  styleUrls: ['./warehouse-goods-delivery-note-form.component.scss'],
  providers: [DecimalPipe]
})
export class WarehouseGoodsDeliveryNoteFormComponent extends DataManagerFormComponent<WarehouseGoodsDeliveryNoteModel> implements OnInit {

  componentName: string = 'WarehouseGoodsDeliveryNoteFormComponent';
  idKey = 'Code';
  apiPath = '/warehouse/goods-delivery-notes';
  baseFormUrl = '/warehouse/goods-delivery-note/form';

  previewAfterCreate = true;
  printDialog = WarehouseGoodsDeliveryNotePrintComponent;

  env = environment;

  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  locale = this.cms.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.cms.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.cms.getNumberMaskConfig();
  // sortableInstance: any;

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  // static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: ProductUnitModel[];

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

  warehouseContainerList = [];

  accountingBusinessList: BusinessModel[] = [];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    multiple: true,
    maximumSelectionLength: 1,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  select2OptionForAccessNumbers = {
    placeholder: 'Số truy xuất...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    multiple: true,
    // maximumSelectionLength: 1,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  systemConfigs: SystemConfigModel;

  @ViewChild('newDetailPipSound', { static: true }) newDetailPipSound: ElementRef;
  @ViewChild('increaseDetailPipSound', { static: true }) increaseDetailPipSound: ElementRef;
  @ViewChild('errorSound', { static: true }) errorSound: ElementRef;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<WarehouseGoodsDeliveryNoteFormComponent>,
    public adminProductService: AdminProductService,
    public decimalPipe: DecimalPipe,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

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

    this.cms.systemConfigs$.pipe(takeUntil(this.destroy$)).subscribe(configs => this.systemConfigs = configs);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/products', {
      select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures",
      includeSearchResultLabel: true,
      includeUnits: true,
      sort_SearchRank: 'desc',
    }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa...',
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
    //   id: 'Code',
    //   text: 'Name',
    // },
    // ajax: {
    //   transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
    //     console.log(settings);
    //     this.apiService.getPromise('/admin-product/products', { select: "id=>Code,text=>Name,Code,Sku,Name,OriginName=>Name,FeaturePicture,Pictures", limit: 40, includeUnit: true, includeUnits: true, 'search': settings.data['term'] }).then(rs => {
    //       success(rs);
    //     }).catch(err => {
    //       console.error(err);
    //       failure();
    //     });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     return {
    //       results: data.map(product => {
    //         product.thumbnail = product?.FeaturePicture?.Thumbnail;
    //         // product.id = product.id + '/' + this.cms.getObjectId(product.WarehouseUnit);
    //         product.text = `${product.id} - ` + (product.Sku && `${product.Sku} - ` || '') + `${product.text}`;
    //         return product;
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

  select2OptionForContainer = {
    placeholder: 'Chọn kho/ngăn/kệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    /** Load and cache tax list */
    // if (!PurchaseOrderVoucherFormComponent._taxList) {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
    //     tax['id'] = tax.Code;
    //     tax['text'] = tax.Name;
    //     return tax;
    //   });
    // } else {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList;
    // }

    /** Load and cache unit list */
    // this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', {limit: 'nolimit'})).map(tax => {
    //   tax['id'] = tax.Code;
    //   tax['text'] = tax.Name;
    //   return tax;
    // });
    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list);
    // if (!PurchaseOrderVoucherFormComponent._unitList) {
    // } else {
    //   this.unitList = PurchaseOrderVoucherFormComponent._unitList;
    // }

    this.warehouseContainerList = await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { sort_Path: 'asc', select: 'id=>Code,text=>Path', limit: 'nolimit' });
    this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: 'WAREHOUSEDELIVERY', select: 'id=>Code,text=>Name,type=>Type' });

    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue('');
          });
        });
      }
      return status;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WarehouseGoodsDeliveryNoteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    params['includeUnit'] = true;
    params['includeAccessNumbers'] = true;
    super.executeGet(params, success, error);
  }

  async formLoadx(formData: WarehouseGoodsDeliveryNoteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: WarehouseGoodsDeliveryNoteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);

        // Bulk load containers
        const goodsIds = itemFormData.Details.filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
        await this.bulkLoadGoodsInfo(goodsIds);

        itemFormData.Details.forEach(detail => {
          detail.AccessNumbers = (Array.isArray(detail.AccessNumbers) && detail.AccessNumbers.length > 0 ? (detail.AccessNumbers.map(ac => this.cms.getObjectId(ac)).join('\n') + '\n') : '') as any;
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);

          if (detail.Product) {
            this.onSelectProduct(newDetailFormGroup, detail.Product, true);
            if (detail.Product.Units) {
              const seelctedUnit = detail.Product.Units.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(detail.Unit));
              if (seelctedUnit) {
                this.onSelectUnit(newDetailFormGroup, null, seelctedUnit);
              }
            }
          }

          // this.onSelectUnit(newDetailFormGroup, detail.Unit, true);
        });
        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

    });

  }

  async formLoad(formData: WarehouseGoodsDeliveryNoteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: WarehouseGoodsDeliveryNoteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);

        // Bulk load containers
        const goodsIds = itemFormData.Details.filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
        await this.bulkLoadGoodsInfo(goodsIds);

        itemFormData.Details.forEach(detail => {
          detail.AccessNumbers = (Array.isArray(detail.AccessNumbers) && detail.AccessNumbers.length > 0 ? (detail.AccessNumbers.map(ac => this.cms.getObjectId(ac)).join('\n') + '\n') : '') as any;
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);

          if (detail.Product) {
            this.onSelectProduct(newDetailFormGroup, detail.Product, true);
            if (detail.Product.Units) {
              const seelctedUnit = detail.Product.Units.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(detail.Unit));
              if (seelctedUnit) {
                this.onSelectUnit(newDetailFormGroup, null, seelctedUnit);
              }
            }
          }

          // this.onSelectUnit(newDetailFormGroup, detail.Unit, true);
        });
        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

    });

  }

  makeNewFormGroup(data?: WarehouseGoodsDeliveryNoteModel): FormGroup {
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

      DateOfDelivered: [null, Validators.required],
      DeliveryAddress: [''],
      Title: [''],
      Note: [''],
      SubNote: [''],
      RelativeVouchers: [],
      _total: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      this.addDetailFormGroup(newForm);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseGoodsDeliveryNoteModel): void {
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
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: WarehouseGoodsDeliveryNoteDetailModel): FormGroup {
    let newForm = null;
    newForm = this.formBuilder.group({
      // Id: [''],
      No: [''],
      SystemUuid: [''],
      Type: ['PRODUCT', Validators.required],
      Product: ['', (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Description: ['', Validators.required],
      Quantity: [1],
      // Price: [0],
      Unit: [''],
      // Tax: ['VAT10'],
      // ToMoney: [0],
      Image: [[]],
      Container: ['', (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      // Business: { value: this.accountingBusinessList.filter(f => f.id === 'GOODSDELIVERY'), disabled: true },
      // Business: [this.accountingBusinessList.filter(f => f.id === 'GOODSDELIVERY')],
      Business: [this.accountingBusinessList.filter(f => f.id === 'WAREHOUSETEMPORARYEXPORT')],
      RelateDetail: [''],
      AccessNumbers: [[]]
    });

    if (data) {
      newForm.patchValue(data);

      setTimeout(() => {
        if (data.Unit) newForm.get('Unit').setValue(data.Unit);
      }, 0);

      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }
      this.toMoney(parentFormGroup, newForm);
      newForm['IsManageByAccessNumber'] = data.Product?.IsManageByAccessNumber || false;
    }

    newForm.get('Unit').valueChanges.pipe(takeUntil(this.destroy$), startWith(null), pairwise()).subscribe(([prev, next]) => {
      console.log(prev, next);
      this.onSelectUnit(newForm, prev, next);
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
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) {
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }
  /** End Detail Form */

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
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
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ContactName').setValue(selectedData.Name);
          formGroup.get('ContactPhone').setValue(selectedData.Phone);
          formGroup.get('ContactEmail').setValue(selectedData.Email);
          formGroup.get('ContactAddress').setValue(selectedData.Address);
        }
      }
    }
  }

  // onSelectProduct(detail: FormGroup, selectedData: ProductModel, doNotAutoFill?: boolean) {

  //   console.log(selectedData);
  //   const productId = this.cms.getObjectId(selectedData);
  //   if (productId) {
  //     const descriptionControl = detail.get('Description');
  //     descriptionControl.setValue(selectedData['OriginName']);
  //     if (selectedData.Units && selectedData?.Units.length > 0) {
  //       const defaultUnit = selectedData.Units.find(f => f['DefaultExport'] === true);
  //       detail['unitList'] = selectedData.Units;
  //       detail.get('Unit').setValue(defaultUnit);
  //     }
  //     detail['IsManageByAccessNumber'] = selectedData?.IsManageByAccessNumber;
  //   }
  //   return false;
  // }

  onSelectProductx(detail: FormGroup, selectedData: ProductModel, doNotAutoFill?: boolean) {

    console.log(selectedData);
    const productId = this.cms.getObjectId(selectedData);
    if (productId) {
      if (!doNotAutoFill) {
        const descriptionControl = detail.get('Description');
        descriptionControl.setValue(selectedData['OriginName'] || selectedData['Name']);
      }
      detail['unitList'] = selectedData.Units;
      if (!doNotAutoFill && selectedData.Units && selectedData?.Units.length > 0) {
        const defaultUnit = selectedData.Units.find(f => f['DefaultExport'] === true);
        detail.get('Unit').setValue(defaultUnit);
      }
      // detail['IsManageByAccessNumber'] = selectedData?.IsManageByAccessNumber;
    }
    return false;
  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel, doNotAutoFill?: boolean) {

    console.log(selectedData);
    const productId = this.cms.getObjectId(selectedData);
    if (productId) {
      if (!doNotAutoFill) {
        const descriptionControl = detail.get('Description');
        descriptionControl.setValue(selectedData['OriginName'] || selectedData['Name']);
      }
      detail['unitList'] = selectedData.Units;
      if (!doNotAutoFill && selectedData.Units && selectedData?.Units.length > 0) {
        const defaultUnit = selectedData.Units.find(f => f['DefaultImport'] === true);
        detail.get('Unit').setValue(defaultUnit);
      }
      // detail['IsManageByAccessNumber'] = selectedData?.IsManageByAccessNumber;
    }
    return false;
  }

  async onSelectUnitx(detail: FormGroup, selectedData: ProductModel, force?: boolean) {
    const unitId = this.cms.getObjectId(selectedData);
    const productId = this.cms.getObjectId(detail.get('Product').value);
    if (unitId && productId) {
      const containerList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
        select: 'Code',
        includeUnit: true,
        includeContainers: true,
        includeAccessNumbers: true,
        eq_Code: productId,
        eq_ConversionUnit: unitId
      }).then(goodsList => {
        // const results = [];
        if (goodsList && goodsList.length > 0) {
          if (goodsList[0].WarehouseUnit && goodsList[0].WarehouseUnit['IsManageByAccessNumber']) {
            detail['IsManageByAccessNumber'] = goodsList[0].WarehouseUnit['IsManageByAccessNumber'] || false;
          }
          return goodsList[0].Containers.map(m => ({
            // ...m,
            AccessNumbers: m?.AccessNumbers,
            // AccessNumbers: m?.AccessNumbers?.map(an => ({ id: an, text: an })),
            id: m.Container,
            text: `[${m.ContainerFindOrder}] ${m.ContainerShelfName} - ${m.ContainerPath}: ${m.ContainerDescription}`
          }));
        }
        return [];
      });
      detail['ContainerList'] = containerList;
      if (containerList && containerList.length == 1) {
        detail.get('Container').setValue(containerList[0]);
      }

    }
  }

  goodsMap: { [key: string]: GoodsModel } = {};
  async bulkLoadGoodsInfo(goodsIds: string[]) {
    // Bulk load containers
    const goodsList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
      select: 'Code',
      includeUnit: true,
      includeContainers: true,
      eq_Code: '[' + goodsIds.join(',') + ']',
      limit: 'nolimit'
    });
    for (const goods of goodsList) {
      if (goods.Containers) {
        goods.Containers = goods.Containers.map(m => ({
          id: m.Container,
          text: `[${m.ContainerFindOrder}] ${m.ContainerPath}: ${m.ContainerDescription} (SL tồn: ${this.decimalPipe.transform(m.Inventory, '1.0-0')}})`,
          Unit: m.Unit
        }))
      }
      if (!this.goodsMap[goods.Code]) {
        this.goodsMap[goods.Code] = goods;
      } else {
        if (!this.goodsMap[goods.Code].Containers) {
          this.goodsMap[goods.Code].Containers = [];
        }
        for (const container of goods.Containers) {
          if (!this.goodsMap[goods.Code].Containers.some(f => this.cms.getObjectId(f) == this.cms.getObjectId(container))) {
            this.goodsMap[goods.Code].Containers.push(container);
          }
        }
      }
    }
  }

  async onSelectUnit(detail: FormGroup, prevUnit: ProductUnitConversoinModel, nextUnit: ProductUnitConversoinModel, force?: boolean) {
    const unitId = this.cms.getObjectId(nextUnit);
    const productId = this.cms.getObjectId(detail.get('Product').value);
    if (typeof nextUnit?.IsManageByAccessNumber !== 'undefined') {
      detail['IsManageByAccessNumber'] = nextUnit.IsManageByAccessNumber;
      if (!this.isProcessing) {
        detail.get('AccessNumbers').setValue(null);
      }
    }
    if (unitId && productId) {

      let containerList = [];

      if (this.goodsMap[productId]) {
        containerList = (this.goodsMap[productId].Containers || []).filter(f => this.cms.getObjectId(f.Unit) == unitId);
      }
      if (containerList.length == 0) {
        containerList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
          select: 'Code',
          includeUnit: true,
          includeContainers: true,
          eq_Code: productId,
          eq_ConversionUnit: unitId
        }).then(goodsList => {
          if (goodsList && goodsList.length > 0) {
            return goodsList[0].Containers.map(m => ({
              id: m.Container,
              text: `[${m.ContainerFindOrder}] ${m.ContainerPath}: ${m.ContainerDescription} (SL tồn: ${this.decimalPipe.transform(m.Inventory, '1.0-0')}})`
            }));
          }
          return [];
        });
      }
      detail['ContainerList'] = containerList;
      if (containerList && containerList.length == 1) {
        detail.get('Container').setValue(containerList[0]);
      }

      // Convertsion quantity
      if (prevUnit && prevUnit.id && !prevUnit.ConversionRatio) {
        const product: ProductModel = detail.get('Product').value;
        if (product && (product.Units || product.UnitConversions)) {
          if (!product.Units) {
            product.Units = product.UnitConversions.map(m => ({ ...m, id: this.cms.getObjectId(m.Unit), text: m.Name }))
          }
        }
        prevUnit = product?.Units.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(prevUnit))
      }
      if (prevUnit && nextUnit && this.cms.getObjectId(prevUnit) != this.cms.getObjectId(nextUnit) && prevUnit.ConversionRatio && nextUnit.ConversionRatio) {
        const currentQuantity = parseFloat(detail.get('Quantity').value);

        let baseQuantity = currentQuantity * prevUnit.ConversionRatio;
        let nextQuantity = baseQuantity / nextUnit.ConversionRatio;

        detail.get('Quantity').setValue(nextQuantity);
      }
    }
  }

  async onSelectContainer(detail: FormGroup, selectedData: ProductModel, force?: boolean) {
    console.log(selectedData);
    // if (selectedData && selectedData['AccessNumbers']) {
    //   detail['AccessNumberList'] = selectedData['AccessNumbers'].map(accessNumber => {
    //     const coreEmbedId = this.systemConfigs.ROOT_CONFIGS.coreEmbedId;
    //     const unit = detail.get('Unit').value;
    //     const unitSeq = unit?.Sequence || '';
    //     let goodsId = this.cms.getObjectId(detail.get('Product').value).replace(new RegExp(`^118${coreEmbedId}`), '');
    //     goodsId = (unitSeq + '').length + unitSeq + goodsId;
    //     let an = accessNumber.replace(/^127/, '');

    //     accessNumber = { id: accessNumber, text: (goodsId.length + 10 + '').padStart(2, '0') + `${goodsId}` + an };
    //     return accessNumber;
    //   });
    // } else {
    //   detail['AccessNumberList'] = [];
    // }
  }
  onSelectAccessNumbers(detail: FormGroup, event: any, force?: boolean, element?: any) {
    // console.log(selectedData);
    // if (detail['IsManageByAccessNumber']) {
    //   detail.get('Quantity').setValue(detail.get('AccessNumbers').value.length);
    // }
    if (event.key == 'Enter' || force) {
      detail.get('Quantity').setValue(element.value.trim().split('\n').filter(ac => !!ac).length);
    }
  }

  calculatToMoney(detail: FormGroup) {
    // let toMoney = detail.get('Quantity').value * detail.get('Price').value;
    // let tax = detail.get('Tax').value;
    // if (tax) {
    //   if (typeof tax === 'string') {
    //     tax = this.taxList.filter(t => t.Code === tax)[0];
    //   }
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    // return toMoney;
    return 0;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    // detail.get('ToMoney').setValue(this.calculatToMoney(detail));

    // // Call culate total
    // const details = this.getDetails(formItem);
    // let total = 0;
    // for (let i = 0; i < details.controls.length; i++) {
    //   total += this.calculatToMoney(details.controls[i] as FormGroup);
    // }
    // formItem.get('_total').setValue(total);
    return false;
  }


  // async preview(formItem: FormGroup) {
  //   const data: WarehouseGoodsDeliveryNoteModel = formItem.value;
  //   // data.Details.forEach(detail => {
  //   //   if (typeof detail['Tax'] === 'string') {
  //   //     detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
  //   //     if (this.unitList) {
  //   //       detail['Unit'] = (detail['Unit'] && detail['Unit'].Name) || this.unitList.filter(t => t.Code === detail['Unit'])[0] as any;
  //   //     }
  //   //   }
  //   // });
  //   this.cms.openDialog(WarehouseGoodsDeliveryNotePrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       data: [data],
  //       idKey: ['Code'],
  //       onSaveAndClose: (priceReport: WarehouseGoodsDeliveryNoteModel) => {
  //         this.saveAndClose();
  //       },
  //       onSaveAndPrint: (priceReport: WarehouseGoodsDeliveryNoteModel) => {
  //         this.save();
  //       },
  //     },
  //   });
  //   return false;
  // }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      for (const detail of item.Details) {
        if (typeof detail.AccessNumbers == 'number') {
          detail.AccessNumbers += '';
        }
        if (typeof detail.AccessNumbers == 'string') {
          detail.AccessNumbers = detail?.AccessNumbers.trim().split('\n').filter(ac => !!ac).map(ac => {
            if (/^127/.test(ac)) {
              return { id: ac, text: ac };
            }
            const acd = this.cms.decompileAccessNumber(ac);
            return { id: acd.accessNumber, text: acd.accessNumber };
          });
        }
      }
    }
    return data;
  }

  openRelativeVoucherChoosedDialogX(formGroup: FormGroup) {
    this.cms.openDialog(SalesVoucherListComponent, {
      context: {
        inputMode: 'dialog',
        onDialogChoose: async (chooseItems: SalesVoucherModel[]) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          for (let i = 0; i < chooseItems.length; i++) {
            const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
            if (index < 0) {
              const details = this.getDetails(formGroup);
              // get purchase order
              const salesVoucher = await this.apiService.getPromise<SalesVoucherModel[]>('/sales/sales-vouchers/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

              if (this.cms.getObjectId(salesVoucher.State) != 'APPROVED') {
                this.cms.toastService.show(this.cms.translateText('Phiếu bán hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                continue;
              }
              if (this.cms.getObjectId(formGroup.get('Object').value)) {
                if (this.cms.getObjectId(salesVoucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                  this.cms.toastService.show(this.cms.translateText('Nhà cung cấp trong phiếu bán hàng không giống với phiếu xuất kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
              } else {
                delete salesVoucher.Id;
                delete salesVoucher.Code;
                formGroup.patchValue({ ...salesVoucher, Details: [] });
                details.clear();
              }
              insertList.push(chooseItems[i]);

              // Insert order details into voucher details
              if (salesVoucher?.Details) {
                details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu bán hàng: ' + salesVoucher.Code + ' - ' + salesVoucher.Title }));
                for (const voucherDetail of salesVoucher.Details) {
                  if (voucherDetail.Type === 'PRODUCT') {
                    delete voucherDetail.Id;
                    delete voucherDetail.Voucher;
                    delete voucherDetail.No;
                    const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Business: this.accountingBusinessList.filter(f => f.id === 'GOODSDELIVERY') });
                    details.push(newDtailFormGroup);
                  }
                }
              }

            }
          }
          relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'SALES', typeMap: this.cms.voucherTypeMap['SALES'] }))]);

          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
        onDialogClose: () => {
        },
      }
    })
    return false;
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.cms.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'SALES': { title: 'Phiếu bán hàng' },
          'DEPLOYMENT': { title: 'Phiếu triển khai' },
          'PRICEQUOTATION': { title: 'Phiếu báo giá' },
          'CLBRTORDER': { title: 'Đơn hàng CTV Bán hàng' },
          'WPORDER': { title: 'Đơn hàng WP' },
        },
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems, type);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'SALES') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const refVoucher = await this.apiService.getPromise<SalesVoucherModel[]>('/sales/sales-vouchers/' + chooseItems[i].Code, { includeContact: true, includeDetails: true, includeUnit: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.cms.getObjectId(refVoucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu bán hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(refVoucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Nhà cung cấp trong phiếu bán hàng không giống với phiếu xuất kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete refVoucher.Id;
                  // delete refVoucher.Code;
                  formGroup.patchValue({ ...refVoucher, Id: null, Code: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Bulk load goods info
                const goodsIds = (refVoucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu bán hàng: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      delete voucherDetail.Id;
                      delete voucherDetail.Voucher;
                      delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Business: this.accountingBusinessList.filter(f => f.id === 'GOODSDELIVERY') });
                      details.push(newDtailFormGroup);
                      this.onSelectUnit(newDtailFormGroup, null, voucherDetail.Unit, true);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type, typeMap: this.cms.voucherTypeMap[type] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'PRICEREPORT' || type === 'PRICEQUOTATION') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const refVoucher = await this.apiService.getPromise<SalesVoucherModel[]>('/sales/price-quotations/' + chooseItems[i].Code, { includeContact: true, includeDetails: true, includeProductUnitList: true }).then(rs => rs[0]);

                if (['APPROVED'].indexOf(this.cms.getObjectId(refVoucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu báo giá chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(refVoucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Khách hàng trong phiếu bán hàng không giống với phiếu xuất kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  // delete refVoucher.Id;
                  // delete refVoucher.Code;
                  formGroup.patchValue({ ...refVoucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Bulk load goods info
                const goodsIds = (refVoucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu báo giá: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT' && voucherDetail.Business && voucherDetail.Business.some(s => this.cms.getObjectId(s) == 'GOODSDELIVERY')) {
                      // delete voucherDetail.Id;
                      // delete voucherDetail.Voucher;
                      // delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Voucher: null, No: null, Business: this.accountingBusinessList.filter(f => f.id === 'GOODSDELIVERY'), RelateDetail: `PRICEQUOTATION/${refVoucher.Code}/${voucherDetail.SystemUuid}` });
                      details.push(newDtailFormGroup);
                      this.onSelectProduct(newDtailFormGroup, voucherDetail.Product, true);
                      // this.onSelectUnit(newDtailFormGroup, voucherDetail.Unit, true);
                      const selectedUnit = voucherDetail.Product.Units.find(f => f.id == this.cms.getObjectId(voucherDetail.Unit));
                      if (selectedUnit) {
                        this.onSelectUnit(newDtailFormGroup, null, voucherDetail.Unit, true);
                      }
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type, typeMap: this.cms.voucherTypeMap[type] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'CLBRTORDER') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const refVoucher = await this.apiService.getPromise<SalesVoucherModel[]>('/collaborator/orders/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['TRANSPORT'].indexOf(this.cms.getObjectId(refVoucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Đơn hàng chưa chốt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(refVoucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Khách hàng trong phiếu bán hàng không giống với phiếu xuất kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  // delete refVoucher.Id;
                  // delete refVoucher.Code;
                  formGroup.patchValue({ ...refVoucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Bulk load goods info
                const goodsIds = (refVoucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Đơn hàng CTV Bán hàng: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete voucherDetail.Id;
                      // delete voucherDetail.Voucher;
                      // delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Voucher: null, No: null, Business: [], RelateDetail: `CLBRTORDER/${refVoucher.Code}/${voucherDetail.Id}` });
                      newDtailFormGroup.get('Business').setValue([{ id: 'WHTRANSPORT', text: 'Đang vận chuyển (xuất kho hàng đi đường)', 'type': 'WAREHOUSEDELIVERY' }]);
                      details.push(newDtailFormGroup);

                      this.onSelectUnit(newDtailFormGroup, null, voucherDetail.Unit, true);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type, typeMap: this.cms.voucherTypeMap[type] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'DEPLOYMENT') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const refVoucher = await this.apiService.getPromise<DeploymentVoucherModel[]>('/deployment/vouchers/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.cms.getObjectId(refVoucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu bán hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(refVoucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Nhà cung cấp trong phiếu bán hàng không giống với phiếu xuất kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  // delete refVoucher.Id;
                  formGroup.patchValue({ ...refVoucher, Id: null, Code: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Bulk load goods info
                const goodsIds = (refVoucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu bán hàng: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete voucherDetail.Id;
                      // delete voucherDetail.Voucher;
                      // delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Voucher: null, No: null, Business: this.accountingBusinessList.filter(f => f.id === 'GOODSDELIVERY'), RelateDetail: voucherDetail.RelateDetail });
                      details.push(newDtailFormGroup);
                      this.onSelectUnit(newDtailFormGroup, null, voucherDetail.Unit, true);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type, typeMap: this.cms.voucherTypeMap[type] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'WPORDER') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const refVoucher = await this.apiService.getPromise<WpOrderModel[]>('/wordpress/orders/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['APPROVED'].indexOf(this.cms.getObjectId(refVoucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Đơn hàng chưa chốt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(refVoucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Khách hàng trong đơn hàng không giống với phiếu xuất kho'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  // delete refVoucher.Id;
                  // delete refVoucher.Code;
                  formGroup.patchValue({ ...refVoucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Bulk load goods info
                const goodsIds = (refVoucher.Details || []).filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
                await this.bulkLoadGoodsInfo(goodsIds);

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Đơn hàng WP Bán hàng: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete voucherDetail.Id;
                      // delete voucherDetail.Voucher;
                      // delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Voucher: null, No: null, Business: [], RelateDetail: `WPsORDER/${refVoucher.Code}/${voucherDetail.Id}` });
                      newDtailFormGroup.get('Business').setValue([{ id: 'WHTRANSPORT', text: 'Đang vận chuyển (xuất kho hàng đi đường)', 'type': 'WAREHOUSEDELIVERY' }]);
                      details.push(newDtailFormGroup);

                      this.onSelectUnit(newDtailFormGroup, null, voucherDetail.Unit, true);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type, typeMap: this.cms.voucherTypeMap[type] }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
      }
    });
    return false;
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.cms.previewVoucher(this.cms.getObjectId(relativeVocher.type), relativeVocher);
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.cms.getObjectId(relativeVocher)));
    return false;
  }

  public barcode = '';
  onKeyboardEvent(event: KeyboardEvent) {
    // if(this.cms.dialogStack) {

    // }
    if (this.ref && document.activeElement.tagName == 'BODY') {
      this.barcode += event.key;
      this.cms.takeUntil('warehouse-receipt-note-barcode-scan', 100).then(() => {
        console.log(this.barcode);
        if (this.barcode && /Enter$/.test(this.barcode)) {
          try {
            if (this.barcode.length > 5) {
              this.barcodeProcess(this.barcode.replace(/Enter$/, ''));
            }
            // this.findOrderKeyInput = '';
          } catch (err) {
            this.cms.toastService.show(err, 'Cảnh báo', { status: 'warning' });
          }
        }
        this.barcode = '';
      });
    }
    return true;
  }

  public activeDetailIndex = 0;
  barcodeProcess(barcode: string) {
    console.log(barcode);
    // const coreId = this.systemConfigs.ROOT_CONFIGS.coreEmbedId;

    // const productIdLength = parseInt(barcode.substring(0, 2)) - 10;
    // let accessNumber = barcode.substring(productIdLength + 2);
    // if (accessNumber) {
    //   accessNumber = '127' + accessNumber;
    // }

    const extracted = this.cms.extractGoodsBarcode(barcode);
    let accessNumber = parseInt(extracted.accessNumber as any);
    // let accessNumber: string = extracted.accessNumber + '';
    let productId = extracted.productId;
    let unitSeq = extracted.unitSeq;
    // let unit = this.unitMap[unitSeq];
    // let unitId = this.cms.getObjectId(unit);

    // let productId = barcode.substring(2, 2 + productIdLength);
    // let unitIdLength = parseInt(productId.slice(0, 1));
    // let unitSeq = productId.slice(1, unitIdLength + 1);
    // productId = productId.slice(unitIdLength + 1);
    // productId = '118' + coreId + productId;

    this.apiService.getPromise<any[]>('/warehouse/goods', {
      includeCategories: true,
      includeFeaturePicture: true,
      includeUnit: true,
      includeContainers: true,
      includeInventory: true,
      sort_Id: 'desc',
      offset: 0,
      limit: 100,
      eq_Code: productId,
      eq_UnitSeq: unitSeq,
    }).then(rs => {
      console.log(rs);
      const details = this.getDetails(this.array.controls[0] as FormGroup);
      for (const goods of rs) {

        if (goods.Containers) {
          let isNotInStock = true;
          for (const container of goods.Containers) {
            container.text = '[' + container.ContainerFindOrder + '] ' + container.ContainerShelfName + ' - ' + container.text;
            if (container.AccessNumbers?.indexOf(accessNumber) > -1) {
              isNotInStock = false;
              // details['IsManageByAccessNumber'] = true;
              let existGoodsIndex = details.controls.findIndex(detail => this.cms.getObjectId(detail.get('Product').value) == goods.Code && this.cms.getObjectId(detail.get('Unit').value) == this.cms.getObjectId(goods.WarehouseUnit) && this.cms.getObjectId(detail.get('Container').value) == this.cms.getObjectId(container));
              // let existsGoods = details.controls.find(f => this.cms.getObjectId(f.get('Product').value) == goods.Code && this.cms.getObjectId(f.get('Unit').value) == this.cms.getObjectId(goods.WarehouseUnit));
              let existsGoods = details.controls[existGoodsIndex];
              if (!existsGoods) {
                if (!this.cms.getObjectId(details.controls[0]?.get('Product').value)) {
                  details.removeAt(0);
                }
                existsGoods = this.makeNewDetailFormGroup(this.array.controls[0] as FormGroup, {
                  Product: { Code: goods.Code, id: goods.Code, text: goods.Name },
                  Unit: goods.WarehouseUnit,
                  Container: container,
                  AccessNumbers: accessNumber + '',
                  Quantity: 1,
                  Description: goods.Name,
                  Pictures: goods.Pictures,
                } as any);
                existsGoods['IsManageByAccessNumber'] = true;
                existsGoods['ContainerList'] = [container];
                details.push(existsGoods);
                this.newDetailPipSound.nativeElement.play();

                this.activeDetailIndex = details.length - 1;
                setTimeout(() => {
                  $('.form-detail-item').eq(this.activeDetailIndex)[0]?.scrollIntoView();
                }, 0);
              } else {
                existsGoods['IsManageByAccessNumber'] = true;
                existsGoods['ContainerList'] = [container];
                let currentAccessNumbers: string = (existsGoods.get('AccessNumbers').value + '') || '';
                this.activeDetailIndex = existGoodsIndex;
                $('.form-detail-item').eq(this.activeDetailIndex)[0]?.scrollIntoView();
                if (currentAccessNumbers.indexOf(accessNumber + '') < 0) {
                  // currentAccessNumbers.push(accessNumber);
                  currentAccessNumbers += '\n' + accessNumber;
                  existsGoods.get('Container').setValue(container);
                  existsGoods.get('AccessNumbers').setValue(currentAccessNumbers);
                  existsGoods.get('Quantity').setValue(currentAccessNumbers.trim().split('\n').length);
                  this.increaseDetailPipSound.nativeElement.play();
                } else {
                  this.cms.toastService.show(`${accessNumber} đang có trong danh sách rồi !`, 'Số truy xuất đang trong danh sánh !', { status: 'warning' });
                  this.errorSound.nativeElement.play();
                  $('.form-detail-item').eq(this.activeDetailIndex)[0]?.scrollIntoView();
                }
              }
              break;
            }
          }
          if (isNotInStock) {
            this.cms.toastService.show(`${goods.Code} - ${goods.Name} không có trong kho !`, 'Hàng hóa không có trong kho !', { status: 'warning' });
            this.errorSound.nativeElement.play();
          }
        }


      }
    });

  }

}
