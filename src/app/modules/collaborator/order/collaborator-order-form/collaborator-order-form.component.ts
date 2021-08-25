import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { filter, take } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.prod';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { CustomIcon } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { CollaboratorPageModel } from '../../../../models/collaborator.model';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { SalesPriceReportModel, SalesPriceReportDetailModel, SalesMasterPriceTableDetailModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { SalesPriceReportPrintComponent } from '../../../sales/price-report/sales-price-report-print/sales-price-report-print.component';
import { CollaboratorService } from '../../collaborator.service';
import { CollaboratorOrderPrintComponent } from '../collaborator-order-print/collaborator-order-print.component';

@Component({
  selector: 'ngx-collaborator-order-form',
  templateUrl: './collaborator-order-form.component.html',
  styleUrls: ['./collaborator-order-form.component.scss']
})
export class CollaboratorOrderFormComponent extends DataManagerFormComponent<SalesPriceReportModel> implements OnInit {

  componentName: string = 'CollaboratorOrderFormComponent';
  idKey = 'Code';
  apiPath = '/collaborator/orders';
  baseFormUrl = '/collaborator/order/form';

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (UnitModel & { id?: string, text?: string })[];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CollaboratorOrderFormComponent>,
    public collaboratorService: CollaboratorService,
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
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewContact'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          data: [{ Groups: [{ id: 'CUSTOMER', text: this.commonService.translateText('Common.customer') }, { id: 'COMPANY', 'text': this.commonService.translateText('Common.company') }] }],
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Object').patchValue(newContact);
            // this.onSelectProduct(formGroup, newContacgt, option.parentForm)
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  contactControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewContact'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          data: [{ Groups: [{ id: 'CUSTOMER', text: this.commonService.translateText('Common.customer') }, { id: 'PERSONAL', 'text': this.commonService.translateText('Common.personal') }] }],
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Object').patchValue(newContact);
            // this.onSelectProduct(formGroup, newContacgt, option.parentForm)
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  select2ContactOption = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { includeIdText: true, filter_Name: params['term'] ? params['term'] : '', limit: 40 });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data
          // .map(item => {
          //   item['id'] = item['Code'];
          //   item['text'] = item['Name'];
          //   return item;
          // }),
        };
      },
    },
  };

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
      url: params => {
        return this.apiService.buildApiUrl('/sales/master-price-tables', { filter_Title: params['term'] ? params['term'] : '', limit: 20 });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Title'];
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
    placeholder: 'Chọn Hàng hoá/dịch vụ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: false,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/collaborator/product-subscriptions', { select: "id=>Code,text=>Name,Code=>Code,Name=>Name", limit: 40, includeUnit: false, includeUnits: true, unitPrice: true, 'search': params['term'], page: this.collaboratorService.currentpage$?.value });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(product => {
            product['text'] = `${product['text']} - ${product['id']}`;
            return product;
          })
        };
      },
    },
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
  select2OptionForPage = {
    placeholder: 'Chọn trang...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
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
    { id: 'SERVICE', text: 'Dịch vụ' },
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

      // Add page choosed
      // this.collaboratorService.pageList$.pipe(take(1), filter(f => f && f.length > 0)).toPromise().then(pageList => {
      //   this.actionButtonList.unshift({
      //     type: 'select2',
      //     name: 'pbxdomain',
      //     status: 'success',
      //     label: 'Select page',
      //     icon: 'plus',
      //     title: this.commonService.textTransform(this.commonService.translate.instant('Common.createNew'), 'head-title'),
      //     size: 'medium',
      //     select2: {
      //       data: pageList, option: {
      //         placeholder: 'Chọn trang...',
      //         allowClear: false,
      //         width: '100%',
      //         dropdownAutoWidth: true,
      //         minimumInputLength: 0,
      //         keyMap: {
      //           id: 'id',
      //           text: 'text',
      //         },
      //       }
      //     },
      //     value: () => this.collaboratorService.currentpage$.value,
      //     change: (value: any, option: any) => {
      //       this.onChangePage(value);
      //     },
      //     disabled: () => {
      //       return false;
      //     },
      //     click: () => {
      //       // this.gotoForm();
      //       return false;
      //     },
      //   });
      // });

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
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/collaborator/product-units', { limit: 'nolimit' })).map(tax => {
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
    // params['page'] = this.collaboratorService?.currentpage$?.value;
    super.executeGet(params, success, error);
  }

  /** Execute api put */
  executePut(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    // params['page'] = this.collaboratorService?.currentpage$?.value;
    return super.executePut(params, data, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    // params['page'] = this.collaboratorService?.currentpage$?.value;
    return super.executePost(params, data, success, error);
  }

  async formLoad(formData: SalesPriceReportModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: SalesPriceReportModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        details.clear();
        itemFormData.Details.forEach(condition => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, condition);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: SalesPriceReportModel): FormGroup {
    const newForm = this.formBuilder.group({
      Page: [this.collaboratorService.currentpage$.value, Validators.required],
      Code: [''],
      Object: [''],
      ObjectName: ['', Validators.required],
      ObjectEmail: [''],
      ObjectPhone: ['', Validators.required],
      ObjectAddress: [''],
      ObjectBankName: [''],
      ObjectBankAccount: [''],
      ObjectIdentifiedNumber: [''],
      // Contact: [''],
      // ContactName: [''],
      // ContactPhone: [''],
      // ContactEmail: [''],
      // ContactAddress: [''],
      // ContactIdentifiedNumber: [''],
      // ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      // PaymentStep: [''],
      // PriceTable: [''],
      DeliveryAddress: ['', Validators.required],
      DateOfOrder: [new Date(), Validators.required],
      DateOfDelivery: [''],
      Title: ['', Validators.required],
      Note: [''],
      SubNote: [''],
      Reported: [''],
      _total: [''],
      RelativeVouchers: [''],
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
      Tax: ['VAT10'],
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
        newForm['unitList'] = this.commonService.unitList;
      }
    } else {
      newForm['unitList'] = this.commonService.unitList;
    }
    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    this.getDetails(parentFormGroup).push(newChildFormGroup);
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    this.calulateTotal(parentFormGroup);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) {
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

  /** Choose product event */
  onSelectProduct(detail: FormGroup, selectedData: ProductModel, parentForm: FormGroup) {
    console.log(selectedData);
    if (selectedData) {
      detail.get('Description').setValue(selectedData.Name);
      // if (parentForm.get('PriceTable').value) {
      // this.apiService.getPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-tables/getProductPriceByUnits', {
      //   priceTable: this.commonService.getObjectId(parentForm.get('PriceTable').value),
      //   product: this.commonService.getObjectId(selectedData),
      //   includeUnit: true,
      // }).then(rs => {
      // console.log(rs);
      if (selectedData.Units)
        // detail['unitList'] = selectedData.Unit;
        if (selectedData.Units) {
        detail['unitList'] = selectedData.Units;
        // const detaultUnit = selectedData.Units.find(f => f['IsDefaultSales'] === true);
        // if (detaultUnit) {
        // const choosed = rs.find(f => f.UnitCode === detaultUnit.id);
        detail.get('Unit').setValue('');
        // setTimeout(() => detail.get('Unit').setValue(detaultUnit.id), 0);
        setTimeout(() => {
          // detail.get('Price').setValue(choosed.Price);
          this.toMoney(parentForm, detail);
        }, 0);
        // }
      } else {
        detail['unitList'] = this.commonService.unitList;
      }
      // });
      // } else {
      //   detail['unitList'] = this.commonService.unitList;
      //   const detaultUnit = selectedData.Units?.find(f => f['IsDefaultSales'] === true);
      //   if (detaultUnit) {
      //     detail.get('Unit').setValue(detaultUnit);
      //   }
      // }
    } else {
      detail.get('Description').setValue('');
      detail.get('Unit').setValue('');
    }
    return false;
  }

  /** Choose unit event */
  onSelectUnit(detail: FormGroup, selectedData: UnitModel, formItem: FormGroup) {
    if (selectedData && selectedData.Price !== null) {
      detail.get('Price').setValue(selectedData.Price);
      this.toMoney(formItem, detail);
    }
    return false;
  }

  calculatToMoney(detail: FormGroup) {
    let toMoney = detail.get('Quantity').value * detail.get('Price').value;
    let tax = detail.get('Tax').value;
    if (tax) {
      if (typeof tax === 'string') {
        tax = this.taxList.filter(t => t.Code === tax)[0];
      }
      toMoney += toMoney * tax.Tax / 100;
    }
    return toMoney;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    detail.get('ToMoney').setValue(this.calculatToMoney(detail));

    // Call culate total
    // const details = this.getDetails(formItem);
    // let total = 0;
    // for (let i = 0; i < details.controls.length; i++) {
    //   total += this.calculatToMoney(details.controls[i] as FormGroup);
    // }
    // formItem.get('_total').setValue(total);
    this.calulateTotal(formItem);
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


  preview(formItem: FormGroup) {
    const data: SalesPriceReportModel = formItem.value;
    for (const detail of data.Details) {
      detail['Tax'] = this.commonService.getObjectText(this.taxList.find(t => t.Code === this.commonService.getObjectId(detail['Tax'])), 'Lable2');
      detail['Unit'] = this.commonService.getObjectText(this.unitList.find(f => f.id === this.commonService.getObjectId(detail['Unit'])));
    };
    this.commonService.openDialog(CollaboratorOrderPrintComponent, {
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

  // getRawFormData() {
  //   const data = super.getRawFormData();

  //   return data;
  // }

  customIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewProduct'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ProductFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          onDialogSave: (newData: ProductModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.commonService.getObjectId(unit?.Unit), text: this.commonService.getObjectText(unit?.Unit) })) };
            formGroup.get('Product').patchValue(newProduct);
            this.onSelectProduct(formGroup, newProduct, option.parentForm)
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

  // getRawFormData() {
  //   const data = super.getRawFormData();
  //   for (const item of data.array) {
  //     item['Page'] = this.collaboratorService.currentpage$.value;
  //   }
  //   return data;
  // }

  // async save(): Promise<ProductModel[]> {
  //   if (!this.collaboratorService?.currentpage$?.value) {
  //     this.commonService.toastService.show(this.commonService.translateText('Common.error'), 'Bạn chưa chọn trang mà sản phẩm sẽ được khai báo !', {
  //       status: 'danger',
  //     });
  //   }
  //   return super.save();
  // }

  // onChangePage(page: CollaboratorPageModel) {
  //   this.collaboratorService.currentpage$.next(this.commonService.getObjectId(page));
  // }

}
