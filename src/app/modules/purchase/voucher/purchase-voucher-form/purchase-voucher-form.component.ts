import { WarehouseGoodsReceiptNoteModel } from './../../../../models/warehouse.model';
import { ProductUnitModel } from './../../../../models/product.model';
import { ProductUnitFormComponent } from './../../../admin-product/unit/product-unit-form/product-unit-form.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { PurchaseVoucherPrintComponent } from './../purchase-voucher-print/purchase-voucher-print.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { PurchaseOrderVoucherModel, PurchaseVoucherDetailModel, PurchaseVoucherModel } from '../../../../models/purchase.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { PurchaseOrderVoucherListComponent } from '../../order/purchase-order-voucher-list/purchase-order-voucher-list.component';
import { BusinessModel } from '../../../../models/accounting.model';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { CurrencyPipe } from '@angular/common';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';

@Component({
  selector: 'ngx-purchase-voucher-form',
  templateUrl: './purchase-voucher-form.component.html',
  styleUrls: ['./purchase-voucher-form.component.scss'],
  providers: [
    CurrencyPipe,
  ]
})
export class PurchaseVoucherFormComponent extends DataManagerFormComponent<PurchaseVoucherModel> implements OnInit {

  componentName: string = 'PurchaseVoucherFormComponent';
  idKey = 'Code';
  apiPath = '/purchase/vouchers';
  baseFormUrl = '/purchase/vouchers/form';

  previewAfterCreate = true;
  printDialog = PurchaseVoucherPrintComponent;

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  priceCurencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0 };
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0 };
  quantityFormat: CurrencyMaskConfig = { ...this.commonService.getNumberMaskConfig(), precision: 2 };

  towDigitsInputMask = this.commonService.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<PurchaseVoucherFormComponent>,
    public currencyPipe: CurrencyPipe,
    public adminProductService: AdminProductService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'print',
      status: 'primary',
      label: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.preview(option.form);
      },
    });
  }

  previousDebt: number = 0;

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

  uploadConfig = {

  };

  accountingBusinessList: BusinessModel[] = [];

  customIcons: { [key: string]: CustomIcon[] } = {};
  getCustomIcons(name: string): CustomIcon[] {
    if (this.customIcons[name]) return this.customIcons[name];
    return this.customIcons[name] = [{
      icon: 'plus-square-outline',
      title: this.commonService.translateText('Common.addNewProduct'),
      status: 'success',
      states: {
        '<>': {
          icon: 'edit-outline',
          status: 'primary',
          title: this.commonService.translateText('Common.editProduct'),
        },
        '': {
          icon: 'plus-square-outline',
          status: 'success',
          title: this.commonService.translateText('Common.addNewProduct'),
        },
      },
      action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
        const currentProduct = this.commonService.getObjectId(formGroup.get('Product').value);
        this.commonService.openDialog(ProductFormComponent, {
          context: {
            inputMode: 'dialog',
            inputId: currentProduct ? [currentProduct] : null,
            showLoadinng: true,
            onDialogSave: (newData: ProductModel[]) => {
              console.log(newData);
              // const formItem = formGroupComponent.formGroup;
              const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.commonService.getObjectId(unit?.Unit), text: this.commonService.getObjectText(unit?.Unit) })) };
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

  unitCustomIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addUnit'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ProductUnitFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          showLoadinng: true,
          onDialogSave: (newData: UnitModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newUnit: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Unit').patchValue(newUnit);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
    ...this.commonService.makeSelect2AjaxOption('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", includeSearchResultLabel: true, includeUnits: true }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa/dịch vụ...',
      prepareReaultItem: (item) => {
        item.thumbnail = item?.FeaturePicture?.Thumbnail;
        return item;
      }
    }),
    withThumbnail: true,
  };

  select2OptionForUnit = {
    placeholder: 'Chọn ĐVT...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    }
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
    title: this.commonService.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.commonService.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.commonService.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.commonService.getObjectId(formGroup.get('Object').value);
      this.commonService.openDialog(ContactFormComponent, {
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
    title: this.commonService.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.commonService.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.commonService.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.commonService.getObjectId(formGroup.get('Contact').value);
      this.commonService.openDialog(ContactFormComponent, {
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

  // unitList: ProductUnitModel[] = null;
  async loadCache() {
    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list);
  }

  async init(): Promise<boolean> {
    // await this.loadCache();
    /** Load and cache tax list */
    this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!SalesVoucherFormComponent._taxList) {
    // } else {
    //   this.taxList = SalesVoucherFormComponent._taxList;
    // }

    /** Load and cache unit list */
    // this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
    //   tax['id'] = tax.Code;
    //   tax['text'] = tax.Name;
    //   return tax;
    // });
    // if (!SalesVoucherFormComponent._unitList) {
    // } else {
    //   this.taxList = SalesVoucherFormComponent._taxList;
    // }

    this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: 'PURCHASE' }).then(rs => rs.map(accBusiness => {
      accBusiness['id'] = accBusiness.Code;
      accBusiness['text'] = accBusiness.Name;
      return accBusiness;
    }));

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
  executeGet(params: any, success: (resources: PurchaseVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeObject'] = true;
    params['includeDetails'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: PurchaseVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PurchaseVoucherModel) => void) {
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

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: PurchaseVoucherModel): FormGroup {
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
      DateOfPurchase: [null, Validators.required],
      RelativeVouchers: [],
      IncludeInvoice: [false],
      InvoiceNumber: [''],
      _total: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      this.addDetailFormGroup(newForm);
    }
    const titleControl = newForm.get('Title');
    newForm.get('ObjectName').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(objectName => {
      if (objectName && (!titleControl.touched || !titleControl.value) && (!titleControl.value || /^Mua hàng: /.test(titleControl.value))) {
        titleControl.setValue(`Mua hàng: ${objectName}`);
      }
    });

    newForm.get('DateOfPurchase').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(dateOfPurchase => {
      if (dateOfPurchase) {
        this.commonService.lastVoucherDate = dateOfPurchase;
      }
    });

    const objectControl = newForm.get('Object');
    const dateOfPurchaseControl = newForm.get('DateOfPurchase');

    const onObjectOrDateChange = async () => {
      const object = this.commonService.getObjectId(objectControl.value);
      const dateOfPurchase = new Date(new Date(dateOfPurchaseControl.value || new Date().toISOString()).getTime() - 60000).toISOString();
      if (object) {
        const report = await this.apiService.getPromise('/accounting/reports', {
          eq_Accounts: '331',
          groupBy: 'Object',
          toDate: dateOfPurchase,
          eq_Object: '[' + object + ']'
        }).then(rs => rs[0]);
        console.log(report);
        if (report) {
          this.previousDebt = parseFloat(report.TailCredit);
        }
      }
    }
    onObjectOrDateChange();
    objectControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(onObjectOrDateChange);
    dateOfPurchaseControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(onObjectOrDateChange);

    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PurchaseVoucherModel): void {
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
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: PurchaseVoucherDetailModel): FormGroup {
    let newForm: FormGroup;
    newForm = this.formBuilder.group({
      // Id: [''],
      SystemUuid: [''],
      No: [''],
      Type: ['PRODUCT', Validators.required],
      Product: ['', (control: FormControl) => {
        if (newForm && newForm.get('Type').value === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Description: ['', Validators.required],
      Quantity: [1, (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Price: ['', (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Unit: ['', (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      // Tax: ['NOTAX', (control: FormControl) => {
      //   if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
      //     return { invalidName: true, required: true, text: 'trường bắt buộc' };
      //   }
      //   return null;
      // }],
      ToMoney: [0],
      Image: [[]],
      // Business: {
      //   value: this.accountingBusinessList.filter(f => f.id === 'PURCHASEWAREHOUSE' || f.id === 'NETREVENUE'),
      //   disabled: false,
      // },
      RelateDetail: [''],
      Business: [null, (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }]
    });

    if (data) {
      if (data?.Product && Array.isArray(data.Product['Units'])) {
        const unitControl = newForm.get('Unit');
        unitControl['UnitList'] = data?.Product['Units'];
      }
      newForm.patchValue(data);
      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }

    }

    // const imagesFormControl = newForm.get('Image');
    // newForm.get('Product').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
    //   if (value) {
    //     if (value.Pictures && value.Pictures.length > 0) {
    //       imagesFormControl.setValue(value.Pictures);
    //     } else {
    //       imagesFormControl.setValue([]);
    //     }
    //   }
    // });

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
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup, detailsFormArray.length - 1);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup, index: number) {
    this.updateInitialFormPropertiesCache(newChildFormGroup);
    this.toMoney(parentFormGroup, newChildFormGroup, null, index);
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
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
          // formGroup.get('ContactTaxCode').setValue(selectedData.TaxCode);
          // formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          // formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }
  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel) {
    console.log(selectedData);
    if (!this.isProcessing) {
      const unitControl = detail.get('Unit');
      if (selectedData) {
        detail.get('Description').setValue(selectedData.Name);
        if (selectedData.Units && selectedData.Units.length > 0) {
          unitControl['UnitList'] = selectedData.Units;
          unitControl.patchValue(selectedData.Units.find(f => f['DefaultImport'] === true || f['IsDefaultPurchase'] === true));
        } else {
          unitControl['UnitList'] = [];
          unitControl['UnitList'] = null;
        }
        detail.get('Description').setValue(selectedData.Name);

        if (selectedData.Pictures && selectedData.Pictures.length > 0) {
          detail.get('Image').setValue(selectedData.Pictures);
        } else {
          detail.get('Image').setValue([]);
        }
      } else {
        detail.get('Description').setValue('');
        detail.get('Unit').setValue('');
        unitControl['UnitList'] = [];
        unitControl['UnitList'] = null;
      }
    }
    return false;
  }

  calculatToMoney(detail: FormGroup, source?: string) {
    // let tax = detail.get('Tax').value;
    // if (typeof tax === 'string') {
    //   tax = this.taxList.filter(t => t.Code === tax)[0];
    // }
    if (source === 'ToMoney') {
      let price = detail.get('ToMoney').value / detail.get('Quantity').value;
      // if (tax) {
      //   price = price / (1 + parseFloat(tax.Tax) / 100);
      // }
      // console.log(detail.value);
      return price;
    } else {
      let toMoney = detail.get('Quantity').value * detail.get('Price').value;

      // if (tax) {
      //   if (typeof tax === 'string') {
      //     tax = this.taxList.filter(t => t.Code === tax)[0];
      //   }
      //   toMoney += toMoney * tax.Tax / 100;
      // }
      // console.log(detail.value);
      return toMoney;
    }
  }

  toMoney(formItem: FormGroup, detail: FormGroup, source?: string, index?: number) {
    this.commonService.takeUntil(this.componentName + '_ToMoney_' + index, 300).then(() => {
      if (source === 'ToMoney') {
        detail.get('Price').setValue(this.calculatToMoney(detail, source));
      } else {
        detail.get('ToMoney').setValue(this.calculatToMoney(detail));
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


  // async preview(formItem: FormGroup) {
  //   const data: PurchaseVoucherModel = formItem.value;
  //   // data.Details.forEach(detail => {
  //   //   if (typeof detail['Tax'] === 'string') {
  //   //     detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
  //   //     if (this.unitList) {
  //   //       detail['Unit'] = (detail['Unit'] && detail['Unit'].Name) || this.unitList.filter(t => t.Code === detail['Unit'])[0] as any;
  //   //     }
  //   //   }
  //   // });
  //   this.commonService.openDialog(PurchaseVoucherPrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       data: [data],
  //       idKey: ['Code'],
  //       onSaveAndClose: (priceReport: PurchaseVoucherModel) => {
  //         this.saveAndClose();
  //       },
  //       onSaveAndPrint: (priceReport: PurchaseVoucherModel) => {
  //         this.save();
  //       },
  //     },
  //   });
  //   return false;
  // }

  getRawFormData() {
    return super.getRawFormData();
  }

  openRelativeVoucherChoosedDialogx(formGroup: FormGroup) {
    this.commonService.openDialog(PurchaseOrderVoucherListComponent, {
      context: {
        inputMode: 'dialog',
        onDialogChoose: async (chooseItems: PurchaseVoucherModel[]) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          const details = this.getDetails(formGroup);
          for (let i = 0; i < chooseItems.length; i++) {
            const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
            if (index < 0) {
              // get purchase order
              const purchaseOrder = await this.apiService.getPromise<PurchaseOrderVoucherModel[]>('/purchase/order-vouchers/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

              if (this.commonService.getObjectId(purchaseOrder.State) != 'APPROVED') {
                this.commonService.toastService.show(this.commonService.translateText('Đơn đặt mua hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                continue;
              }
              if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                if (this.commonService.getObjectId(purchaseOrder.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                  this.commonService.toastService.show(this.commonService.translateText('Nhà cung cấp trong đơn đặt mua hàng không giống với phiếu mua hàng'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
              } else {
                delete purchaseOrder.Id;
                // delete purchaseOrder.Code;
                formGroup.patchValue({ ...purchaseOrder, Id: null, Code: null, Details: [] });
                details.clear();
              }
              insertList.push(chooseItems[i]);

              // Insert order details into voucher details
              if (purchaseOrder?.Details) {
                details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Id: null, Description: 'Phiếu đặt mua hàng: ' + purchaseOrder.Code + ' - ' + purchaseOrder.Title }));
                for (const orderDetail of purchaseOrder.Details) {
                  if (orderDetail.Type !== 'CATEGORY') {
                    delete orderDetail.Id;
                    // delete orderDetail.Order;
                    delete orderDetail.No;
                    const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...orderDetail, Id: null } as any);
                    details.push(newDtailFormGroup);
                    await new Promise(resolve => setTimeout(() => resolve(true), 300));
                    this.toMoney(formGroup, newDtailFormGroup);
                  }
                }
              }

            }
          }
          relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASEORDER' }))]);
          this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');

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
    this.commonService.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'PURCHASEORDER': { title: 'Đơn đặt mua hàng' },
          // 'GOODSRECEIPT': { title: 'Phiếu nhập kho' },
        },
        // inputMode: 'dialog',
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'PURCHASEORDER') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<PurchaseOrderVoucherModel[]>('/purchase/order-vouchers/' + chooseItems[i].Code, { includeContact: true, includeDetails: true, includeRelativeVouchers: true, includeIdText: true }).then(rs => rs[0]);

                // Check purchase order state
                if (['APPROVED'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.showToast(this.commonService.translateText('Phiếu đặt mua hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }

                // Check goods receipt notes
                const relativeGoodsReceiptVouchers = voucher.RelativeVouchers.filter(f => f.type == 'GOODSRECEIPT');
                if (relativeGoodsReceiptVouchers.length == 0) {
                  this.commonService.showDialog('Thêm chứng từ liên quan', 'Không thể tạo phiếu mua hàng từ đơn đặt hàng chưa được nhập kho !', []);
                  continue;
                }

                const goodsReceiptNotes = await this.apiService.getPromise<WarehouseGoodsReceiptNoteModel[]>('/warehouse/goods-receipt-notes', { id: relativeGoodsReceiptVouchers.map(m => this.commonService.getObjectId(m)), includeIdText: true });
                for (const goodsReceiptNote of goodsReceiptNotes) {
                  if (goodsReceiptNote.State != 'APPROVED') {
                    this.commonService.showDialog('Thêm chứng từ liên quan', 'Phiếu nhập kho liên quan chưa được duyệt !', []);
                    continue;
                  }
                  insertList.push({ id: goodsReceiptNote.Code, text: goodsReceiptNote.Title, type: 'GOODSRECEIPT' });
                }

                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.showToast(this.commonService.translateText('Nhà cung cấp trong phiếu đặt mua hàng không giống với phiếu mua hàng'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push({ id: chooseItems[i].Code, text: chooseItems[i].Title, type: 'PURCHASEORDER' });

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu đặt mua hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type !== 'CATEGORY') {
                      const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Business: null, RelateDetail: `PURCHASEORDER/${voucher.Code}/${voucherDetail.SystemUuid}` } as any);
                      details.push(newDetailFormGroup);
                      await new Promise(resolve => setTimeout(() => resolve(true), 300));
                      this.toMoney(formGroup, newDetailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id, text: m.text, type: m.type }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'GOODSRECEIPT') {// Code mẫu chưa xử lý
            // 
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<WarehouseGoodsReceiptNoteModel[]>('/warehouse/goods-delivery-notes/' + chooseItems[i].Code, { includeContact: true, includeDetails: true, dIncludeUnitConversionCalculate: true, includeAccessNumbers: true }).then(rs => rs[0]);

                if (['APPROVED'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Phiếu xuất kho chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.toastService.show(this.commonService.translateText('Đối tượng theo dõi trong phiếu nhập không giống với phiếu nhập xuất'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Id: null, Description: 'Phiếu xuất: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;

                      // check duplicate
                      const existsDetail = details.controls.find(fDetail => this.commonService.getObjectId(fDetail.get('Product').value) == this.commonService.getObjectId(voucherDetail.Product) && this.commonService.getObjectId(fDetail.get('Unit').value) == this.commonService.getObjectId(voucherDetail.Unit));
                      if (!existsDetail) {

                        const accessNumbers = voucherDetail.AccessNumbers && Array.isArray(voucherDetail.AccessNumbers) && voucherDetail.AccessNumbers.length > 0 ? (voucherDetail.AccessNumbers.map(ac => this.commonService.getObjectId(ac)).join('\n')) : '';
                        const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, No: null, Voucher: null, Business: null, RelateDetail: `GOODSDELIVERY/${voucher.Code}/${voucherDetail.Id}` });
                        // newDetailFormGroup.get('Business').disable();
                        newDetailFormGroup['case'] = 'REIMPORT';

                        let business = [...voucherDetail.Business];
                        if (business) {
                          const busunessItemIndex = business.findIndex(f => this.commonService.getObjectId(f) == 'WAREHOUSETEMPORARYEXPORT')
                          if (busunessItemIndex > -1) {
                            business[busunessItemIndex] = { id: 'WAREHOUSEREIMPORT', text: 'Tái nhập hàng hóa' };
                          }
                          newDetailFormGroup.get('Business').setValue(business);
                        }

                        details.push(newDetailFormGroup);

                        if (voucherDetail.Product?.Units) {
                          newDetailFormGroup['unitList'] = voucherDetail.Product?.Units;
                        }

                        const chooseUnit = voucherDetail.Product?.Units.find(f => this.commonService.getObjectId(f) == this.commonService.getObjectId(voucherDetail.Unit));
                        // this.onSelectUnit(newDetailFormGroup, chooseUnit, true);
                      } else {
                        // Duplicate
                        // existsDetail.get('Quantity').setValue(parseFloat(existsDetail.get('Quantity').value) + parseFloat(voucherDetail.Quantity));
                        if (voucherDetail.AccessNumbers && voucherDetail.AccessNumbers.length > 0) {
                          existsDetail.get('AccessNumbers').setValue(existsDetail.get('AccessNumbers').value + '\n' + voucherDetail.AccessNumbers.map(m => this.commonService.getObjectId(m)).join('\n'));
                        }

                      }


                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type }))]);
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

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
    // if (relativeVocher) {
    //   if (relativeVocher.type == 'PURCHASEORDER') {
    //     this.commonService.openDialog(PurchaseOrderVoucherPrintComponent, {
    //       context: {
    //         showLoadinng: true,
    //         title: 'Xem trước',
    //         id: [this.commonService.getObjectId(relativeVocher)],
    //         // data: data,
    //         idKey: ['Code'],
    //         // approvedConfirm: true,
    //         onClose: (data: PurchaseVoucherModel) => {
    //           this.refresh();
    //         },
    //       },
    //     });
    //   }
    //   if (relativeVocher.type == 'GOODSRECEIPT') {
    //     this.commonService.openDialog(WarehouseGoodsReceiptNotePrintComponent, {
    //       context: {
    //         showLoadinng: true,
    //         title: 'Xem trước',
    //         id: [this.commonService.getObjectId(relativeVocher)],
    //         // data: data,
    //         idKey: ['Code'],
    //         // approvedConfirm: true,
    //         onClose: (data: WarehouseGoodsReceiptNoteModel) => {
    //           this.refresh();
    //         },
    //       },
    //     });
    //   }
    // }
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.commonService.getObjectId(relativeVocher)));
    return false;
  }

}
