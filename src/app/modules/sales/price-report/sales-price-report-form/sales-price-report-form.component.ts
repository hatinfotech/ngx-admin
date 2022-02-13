import { ProductUnitModel } from './../../../../models/product.model';
import { ContactFormComponent } from './../../../contact/contact/contact-form/contact-form.component';
import { SalesMasterPriceTableDetailModel, SalesPriceTableModel } from './../../../../models/sales.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../../../models/sales.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { SalesPriceReportPrintComponent } from '../sales-price-report-print/sales-price-report-print.component';
import { environment } from '../../../../../environments/environment';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { CustomIcon } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { takeUntil } from 'rxjs/operators';
import { ProductUnitFormComponent } from '../../../admin-product/unit/product-unit-form/product-unit-form.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'ngx-sales-price-report-form',
  templateUrl: './sales-price-report-form.component.html',
  styleUrls: ['./sales-price-report-form.component.scss'],
  providers: [DatePipe]
})
export class SalesPriceReportFormComponent extends DataManagerFormComponent<SalesPriceReportModel> implements OnInit {

  componentName: string = 'SalesPriceReportFormComponent';
  idKey = 'Code';
  apiPath = '/sales/price-reports';
  baseFormUrl = '/sales/price-report/form';

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();
  quantityFormat: CurrencyMaskConfig = { ...this.commonService.getNumberMaskConfig(), precision: 2 };

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (ProductUnitModel & { id?: string, text?: string })[];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<SalesPriceReportFormComponent>,
    public adminProductService: AdminProductService,
    public datePipe?: DatePipe,
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
    action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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
    action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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

  select2SalesPriceReportOption = {
    placeholder: 'Chọn bảng giá...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/sales/master-price-tables', { filter_Title: params['term'] ? params['term'] : '', limit: 20 });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/sales/master-price-tables', { filter_Title: params['term'] ? params['term'] : '', limit: 20 }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = `[` + this.datePipe.transform(item['DateOfCreated'], 'short') + `] ${item['Title']}`;
            return item;
          }),
        };
      },
    },
  };

  uploadConfig = {

  };

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
    // placeholder: 'Chọn Hàng hoá/dịch vụ...',
    // allowClear: true,
    // width: '100%',
    // dropdownAutoWidth: true,
    // minimumInputLength: 0,
    // withThumbnail: true,
    // // tags: false,
    // keyMap: {
    //   id: 'Code',
    //   text: 'Name',
    // },
    // ajax: {
    //   transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
    //     console.log(settings);
    //     this.apiService.getPromise('/admin-product/products', { select: "id=>Code,text=>Name,Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", limit: 40, includeUnit: true, includeUnits: true, 'search': settings.data['term'] }).then(rs => {
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
    //         product.text = `${product.id} - ` + (product.Sku ? `${product.Sku} - ` : '') + `${product.text}`;
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
    // { id: 'SERVICE', text: 'Dịch vụ' },
    { id: 'CATEGORY', text: 'Danh mục' },
  ];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {
    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];

        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('RelativeVouchers').setValue('');
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

  /** Override load cache menthod */
  async loadCache(): Promise<any> {
    const rs = await super.loadCache();
    /** Load and cache tax list */
    this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!SalesPriceReportFormComponent._taxList) {
    // } else {
    //   this.taxList = SalesPriceReportFormComponent._taxList;
    // }

    /** Load and cache unit list */
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!SalesPriceReportFormComponent._unitList) {
    // } else {
    //   this.taxList = SalesPriceReportFormComponent._taxList;
    // }
    return rs;
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SalesPriceReportModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['includeProductUnitList'] = true;
    params['includeProductPrice'] = true;
    params['useBaseTimezone'] = true;
    params['includeRelativeVouchers'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: SalesPriceReportModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: SalesPriceReportModel) => Promise<void>) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        details.clear();
        for (const ic in itemFormData.Details) {
          const detail = itemFormData.Details[ic];
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup, parseInt(ic));
        }
        // itemFormData.Details.forEach(detail => {

        // });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: SalesPriceReportModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Object: [''],
      ObjectName: ['', Validators.required],
      ObjectEmail: [''],
      ObjectPhone: [''],
      ObjectAddress: [''],
      ObjectIdentifiedNumber: [''],
      ObjectBankName: [''],
      ObjectBankCode: [''],
      Contact: [''],
      ContactName: [''],
      ContactPhone: [''],
      ContactEmail: [''],
      ContactAddress: [''],
      ContactIdentifiedNumber: [''],
      // ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      // PaymentStep: [''],
      PriceTable: [''],
      DeliveryAddress: [''],
      Title: ['', Validators.required],
      Note: [''],
      SubNote: [''],
      Reported: [null],
      _total: [''],
      RelativeVouchers: [''],
      RequireInvoice: [false],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      // newForm.patchValue(data);
      this.patchFormGroupValue(newForm, data);
      // this.toMoney(newForm);
    } else {
      this.addDetailFormGroup(newForm);
    }

    const titleControl = newForm.get('Title');
    newForm.get('ObjectName').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(objectName => {
      if (objectName && (!titleControl.touched || !titleControl.value) && (!titleControl.value || /^Báo giá: /.test(titleControl.value))) {
        titleControl.setValue(`Báo giá: ${objectName}`);
      }
    });

    return newForm;
  }

  patchFormGroupValue = (formGroup: FormGroup, data: SalesPriceReportModel) => {

    // for (const propName in data) {
    //   const prop = data[propName];
    //   if (prop && prop.restricted) {
    //     formGroup.get(propName)['placeholder'] = data[propName]['placeholder']
    //     delete (data[propName]);
    //   }
    //   // if (data['ObjectPhone'] && data['ObjectPhone']['restricted']) formGroup.get('ObjectPhone')['placeholder'] = data['ObjectPhone']['placeholder']; else formGroup.get('ObjectPhone').patchValue(data['ObjectPhone']);
    // }

    this.prepareRestrictedData(formGroup, data);
    // if (data['ObjectAddress'] && data['ObjectAddress']['restricted']) formGroup.get('ObjectAddress')['placeholder'] = data['ObjectAddress']['placeholder']; else formGroup.get('ObjectAddress').patchValue(data['ObjectAddress']);
    // if (data['ObjectEmail'] && data['ObjectEmail']['restricted']) formGroup.get('ObjectEmail')['placeholder'] = data['ObjectEmail']['placeholder']; else formGroup.get('ObjectEmail').patchValue(data['ObjectEmail']);
    // if (data['ObjectIdentifiedNumber'] && data['ObjectIdentifiedNumber']['restricted']) formGroup.get('ObjectIdentifiedNumber')['placeholder'] = data['ObjectIdentifiedNumber']['placeholder']; else formGroup.get('ObjectIdentifiedNumber').patchValue(data['ObjectAddress']);
    // // formGroup.get('ObjectAddress')['placeholder'] = data['ObjectAddress'];
    // // data['ObjectPhone'] = null;
    // // data['ObjectAddress'] = null;

    // if (data['ObjectPhone'] && data['ObjectPhone']['restricted']) formGroup.get('ObjectPhone')['placeholder'] = data['ObjectPhone']['placeholder']; else formGroup.get('ObjectPhone').patchValue(data['ObjectPhone']);
    // formGroup.get('ContactPhone')['placeholder'] = data['ContactPhone'];
    // formGroup.get('ContactAddress')['placeholder'] = data['ContactAddress'];
    // data['ContactPhone'] = null;
    // data['ContactAddress'] = null;

    // if (data.Infos?.Description && Array.isArray(data.Infos?.Description)) {
    //   (data.Infos?.Description as any).pop();
    // }
    formGroup.patchValue(data);
    return true;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: SalesPriceReportModel): void {
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
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: SalesPriceReportDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      No: [''],
      Type: ['PRODUCT'],
      Product: [''],
      Description: [''],
      Quantity: [1],
      Price: [0],
      Unit: [''],
      // Tax: ['VAT10'],
      ToMoney: [0],
      Image: [[]],
      Reason: [''],
    });

    if (data) {
      newForm.patchValue(data);
      this.toMoney(parentFormGroup, newForm);
      if (data.Product && data.Product.Units && data.Product.Units.length > 0) {
        newForm['unitList'] = data.Product.Units;
      } else {
        newForm['unitList'] = this.adminProductService.unitList$.value;
      }
    } else {
      newForm['unitList'] = this.adminProductService.unitList$.value;
    }

    const imagesFormControl = newForm.get('Image');
    // setTimeout(() => {
    newForm.get('Product').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (!this.isProcessing && value) {
        if (value.Pictures && value.Pictures.length > 0) {
          imagesFormControl.setValue(value.Pictures);
        } else {
          imagesFormControl.setValue([]);
        }
      }
    });
    // }, 1000);

    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    const details = this.getDetails(parentFormGroup);
    details.push(newChildFormGroup);
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup, details.length - 1);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    this.calulateTotal(parentFormGroup);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup, index: number) {
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
          // formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          // formGroup.get('ObjectEmail').setValue(selectedData.Email);
          // formGroup.get('ObjectAddress').setValue(selectedData.Address);

          if (selectedData['Phone'] && selectedData['Phone']['restricted']) formGroup.get('ObjectPhone')['placeholder'] = selectedData['Phone']['placeholder']; else formGroup.get('ObjectPhone').setValue(selectedData['Phone']);
          if (selectedData['Email'] && selectedData['Email']['restricted']) formGroup.get('ObjectEmail')['placeholder'] = selectedData['Email']['placeholder']; else formGroup.get('ObjectEmail').setValue(selectedData['Email']);
          if (selectedData['Address'] && selectedData['Address']['restricted']) formGroup.get('ObjectAddress')['placeholder'] = selectedData['Address']['placeholder']; else formGroup.get('ObjectAddress').setValue(selectedData['Address']);

          formGroup.get('ObjectIdentifiedNumber').setValue(selectedData.TaxCode);
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
          // formGroup.get('ContactPhone').setValue(selectedData.Phone);
          // formGroup.get('ContactEmail').setValue(selectedData.Email);
          // formGroup.get('ContactAddress').setValue(selectedData.Address);

          if (selectedData['Phone'] && selectedData['Phone']['restricted']) formGroup.get('ContactPhone')['placeholder'] = selectedData['Phone']['placeholder']; else formGroup.get('ContactPhone').setValue(selectedData['Phone']);
          if (selectedData['Email'] && selectedData['Email']['restricted']) formGroup.get('ContactEmail')['placeholder'] = selectedData['Email']['placeholder']; else formGroup.get('ContactEmail').setValue(selectedData['Email']);
          if (selectedData['Address'] && selectedData['Address']['restricted']) formGroup.get('ContactAddress')['placeholder'] = selectedData['Address']['placeholder']; else formGroup.get('ContactAddress').setValue(selectedData['Address']);

          formGroup.get('ContactIdentifiedNumber').setValue(selectedData.TaxCode);
          // formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          // formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }
  }

  async onChangePriceTable(formItem: FormGroup, selectedData: SalesPriceTableModel) {
    const priceTableId = this.commonService.getObjectId(selectedData);
    if (priceTableId) {
      const details = this.getDetails(formItem);
      const productsId = [];
      for (const detail of details.controls) {
        const productId = this.commonService.getObjectId(detail.get('Product').value);
        if (productId) {
          productsId.push(productId);
        }
      }

      const productProceIndex = productsId.length > 0 ? (await this.apiService.getPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-tables/getProductsPriceByUnits', {
        priceTable: priceTableId,
        products: productsId.join(','),
        includeUnit: true,
      }).then(rs => {
        const productPriceIndex = {};
        for (const product of rs) {
          const unitId = this.commonService.getObjectId(product.UnitCode);
          productPriceIndex[`${product.Product}-${unitId}`] = product.Price;
        }
        return productPriceIndex;
      })) : {};
      for (const detail of details.controls) {
        const unitId = this.commonService.getObjectId(detail.get('Unit').value);
        const productId = this.commonService.getObjectId(detail.get('Product').value);
        const typeId = this.commonService.getObjectId(detail.get('Type').value);
        if (typeId !== 'CATEGORY' && productId && unitId) {
          const price = productProceIndex[`${productId}-${unitId}`];
          if (price !== null) {
            detail.get('Price').setValue(price);
            await new Promise(resolve => setTimeout(() => resolve(true), 300));
            this.toMoney(formItem, detail as any);
          }
        }
      }
    }
  }

  /** Choose product event */
  onSelectProduct(detail: FormGroup, selectedData: ProductModel, parentForm: FormGroup) {
    console.log(selectedData);
    const productId = this.commonService.getObjectId(selectedData);
    if (productId) {
      const descriptionControl = detail.get('Description');
      descriptionControl.setValue(selectedData['OriginName']);
      if (selectedData.Units && selectedData?.Units.length > 0) {
        const defaultUnit = selectedData.Units.find(f => f['DefaultExport'] === true);
        detail['unitList'] = selectedData.Units;
        detail.get('Unit').setValue(defaultUnit);
      }
    }
    // if (selectedData) {
    //   detail.get('Description').setValue(selectedData.Name);
    //   if (parentForm.get('PriceTable').value) {
    //     this.apiService.getPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-tables/getProductPriceByUnits', {
    //       priceTable: this.commonService.getObjectId(parentForm.get('PriceTable').value),
    //       product: this.commonService.getObjectId(selectedData),
    //       includeUnit: true,
    //     }).then(rs => {
    //       console.log(rs);
    //       if (selectedData.Units && selectedData?.Units.length > 0) {
    //         detail['unitList'] = selectedData.Units.map(item => {
    //           item.Price = rs.find(f => f.UnitCode == item.id)?.Price as any;
    //           return item;
    //         });
    //         // detail['unitList'] = rs.map(priceDetail => ({ id: priceDetail.UnitCode, text: priceDetail.UnitName, Price: priceDetail.Price }))

    //         const detaultUnit = selectedData.Units.find(f => f['DefaultExport'] === true);
    //         if (detaultUnit) {
    //           const choosed = rs.find(f => f.UnitCode === detaultUnit.id);
    //           detail.get('Unit').setValue('');
    //           setTimeout(() => detail.get('Unit').setValue(detaultUnit), 0);
    //           setTimeout(() => {
    //             if (choosed) {
    //               detail.get('Price').setValue(choosed.Price);
    //             }
    //             this.toMoney(parentForm, detail);
    //           }, 0);
    //         }
    //       } else {
    //         detail['unitList'] = selectedData?.Units && selectedData?.Units.length > 0 ? selectedData.Units : [];
    //       }
    //     });
    //   } else {
    //     detail['unitList'] = selectedData?.Units && selectedData?.Units.length > 0 ? selectedData.Units : [];
    //     const detaultUnit = selectedData.Units?.find(f => f['DefaultExport'] === true);
    //     if (detaultUnit) {
    //       detail.get('Unit').setValue(detaultUnit);
    //     }
    //   }
    // } else {
    //   detail.get('Description').setValue('');
    //   detail.get('Unit').setValue('');
    // }
    return false;
  }

  /** Choose unit event */
  onSelectUnit(detail: FormGroup, selectedData: UnitModel, formItem: FormGroup) {
    if (!this.isProcessing) {
      const unitId = this.commonService.getObjectId(selectedData);
      const priceTableId = this.commonService.getObjectId(formItem.get('PriceTable').value);
      if (priceTableId && unitId) {
        if (this.commonService.getObjectId(detail.get('Type').value) !== 'CATEGORY') {
          this.apiService.getPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-tables/getProductPriceByUnits', {
            priceTable: priceTableId,
            product: this.commonService.getObjectId(detail.get('Product').value),
            includeUnit: true,
          }).then(rs => {
            console.log(rs);
            if (rs && rs.length > 0) {
              // const unitList = detail['unitList'];
              if (detail['unitList'] && detail['unitList'].length > 0) {
                detail['unitList'] = detail['unitList'].map(item => {
                  item.Price = rs.find(f => f.UnitCode == item.id)?.Price;
                  return item;
                });
                const choosed = detail['unitList'].find(f => f.id == this.commonService.getObjectId(selectedData));
                detail.get('Price').setValue(choosed.Price);
                this.toMoney(formItem, detail);
              }
            }
          });
        }
      }
      // if (selectedData && selectedData.Price !== null) {
      //   detail.get('Price').setValue(selectedData.Price);
      //   this.toMoney(formItem, detail);
      // }
    }
    return false;
  }

  // calculatToMoney(detail: FormGroup) {
  //   let toMoney = detail.get('Quantity').value * detail.get('Price').value;
  //   let tax = detail.get('Tax').value;
  //   if (tax) {
  //     if (typeof tax === 'string') {
  //       tax = this.taxList.filter(t => t.Code === tax)[0];
  //     }
  //     toMoney += toMoney * tax.Tax / 100;
  //   }
  //   return toMoney;
  // }



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
      return price;
    } else {
      let toMoney = detail.get('Quantity').value * detail.get('Price').value;

      // if (tax) {
      //   if (typeof tax === 'string') {
      //     tax = this.taxList.filter(t => t.Code === tax)[0];
      //   }
      // toMoney += toMoney * tax.Tax / 100;
      // }
      return toMoney;
    }
  }

  // toMoney(formItem: FormGroup, detail: FormGroup) {
  //   detail.get('ToMoney').setValue(this.calculatToMoney(detail));

  //   // Call culate total
  //   // const details = this.getDetails(formItem);
  //   // let total = 0;
  //   // for (let i = 0; i < details.controls.length; i++) {
  //   //   total += this.calculatToMoney(details.controls[i] as FormGroup);
  //   // }
  //   // formItem.get('_total').setValue(total);
  //   this.calulateTotal(formItem);
  //   return false;
  // }



  toMoney(formItem: FormGroup, detail: FormGroup, source?: string, index?: number) {
    this.commonService.takeUntil(this.componentName + '_ToMoney_ ' + index, 300).then(() => {
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

  calulateTotal(formItem: FormGroup) {
    this.commonService.takeUntil('calulcate_sales_price_report', 300).then(rs => {
      let total = 0;
      const details = this.getDetails(formItem);
      for (let i = 0; i < details.controls.length; i++) {
        total += this.calculatToMoney(details.controls[i] as FormGroup);
      }
      formItem.get('_total').setValue(total);
    });
  }


  async preview(formItem: FormGroup) {
    const data: SalesPriceReportModel = formItem.value;
    for (const detail of data.Details) {
      detail['Tax'] = this.commonService.getObjectText(this.taxList.find(t => t.Code === this.commonService.getObjectId(detail['Tax'])), 'Lable2');
      detail['Unit'] = this.commonService.getObjectText(this.unitList.find(f => f.id === this.commonService.getObjectId(detail['Unit'])));
    };
    this.commonService.openDialog(SalesPriceReportPrintComponent, {
      context: {
        title: 'Xem trước',
        mode: 'preview',
        sourceOfDialog: 'form',
        data: [data],
        onSaveAndClose: (priceReport: SalesPriceReportModel) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (priceReport: SalesPriceReportModel) => {
          this.save();
        },
      },
    });
    return false;
  }

  getRawFormData() {
    const data = super.getRawFormData();

    return data;
  }

  // customIcons: CustomIcon[] = [{
  //   icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewProduct'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
  //     this.commonService.openDialog(ProductFormComponent, {
  //       context: {
  //         inputMode: 'dialog',
  //         // inputId: ids,
  //         onDialogSave: (newData: ProductModel[]) => {
  //           console.log(newData);
  //           // const formItem = formGroupComponent.formGroup;
  //           const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.commonService.getObjectId(unit?.Unit), text: this.commonService.getObjectText(unit?.Unit) })) };
  //           formGroup.get('Product').patchValue(newProduct);
  //           this.onSelectProduct(formGroup, newProduct, option.parentForm)
  //         },
  //         onDialogClose: () => {

  //         },
  //       },
  //       closeOnEsc: false,
  //       closeOnBackdropClick: false,
  //     });
  //   }
  // }];

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
      action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addUnit'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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

  openCreateNewProductForm(array: FormArray, index: number, name: string) {

  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.commonService.getObjectId(relativeVocher)));
    return false;
  }

}
