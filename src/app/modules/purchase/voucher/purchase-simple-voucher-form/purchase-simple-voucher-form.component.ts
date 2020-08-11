import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { PurchaseVoucherModel, PurchaseVoucherDetailModel } from '../../../../models/purchase.model';
import { environment } from '../../../../../environments/environment';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { SalesPriceReportFormComponent } from '../../../sales/price-report/sales-price-report-form/sales-price-report-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PurchaseVoucherPrintComponent } from '../purchase-voucher-print/purchase-voucher-print.component';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { Select2OptionData } from '../../../../../vendor/ng2-select2/lib/ng2-select2';

@Component({
  selector: 'ngx-purchase-simple-voucher-form',
  templateUrl: './purchase-simple-voucher-form.component.html',
  styleUrls: ['./purchase-simple-voucher-form.component.scss'],
})
export class PurchaseSimpleVoucherFormComponent extends DataManagerFormComponent<PurchaseVoucherModel> implements OnInit {

  componentName: string = 'PurchaseSimpleVoucherFormComponent';
  idKey = 'Code';
  baseFormUrl = '/purchase/oucher/form';
  apiPath = '/purchase/vouchers';

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  // localeExtra = localeViExtra;
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();
  // numberFormat = getLocaleNumberFormat('vi', NumberFormatStyle.Decimal);

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (UnitModel & { id?: string, text?: string })[];

  select2ContactOption = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<PurchaseSimpleVoucherFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
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

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct: Select2Option = {
    placeholder: 'Chọn Hàng hoá/dịch vụ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/purchase/products', { includeUnit: true, 'filter_Name': params['term'], limit: 20, includeFeaturePicture: true });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            item['image'] = item['FeaturePictureThumbnail'] ? (item['FeaturePictureThumbnail'] + '?token=' + this.apiService.getAccessToken()) : '';
            return item;
          }),
        };
      },
    },
    templateResult: (state: ProductModel): JQuery | string => {
      if (!state.id) {
        return state.text;
      }
      // tslint:disable-next-line: ban
      return $('\
      <div class="select2-results-option-with-image">\
        <div class="image-wrap" style="width: 3rem; height: 3rem;">\
          <div class="image" style="width: 3rem; height: 3rem; background-image: url(' + state.image + ')"></div>\
        </div>\
        <div class="text">' + state.text + (state.Units ? ('<br>' + this.commonService.translateText('Product.unit') + ': ' + state.Units.map(unit => unit.Name).join(', ')) : '') + '</div>\
      </div>');
    },
    templateSelection: (state: ProductModel): JQuery | string => {
      if (!state.id) {
        return state.text;
      }

      // tslint:disable-next-line: ban
      return $('<span>' + state.text + '</span>');
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    /** Load and cache tax list */
    if (!SalesPriceReportFormComponent._taxList) {
      this.taxList = SalesPriceReportFormComponent._taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
        tax['id'] = tax.Code;
        tax['text'] = tax.Name;
        return tax;
      });
    } else {
      this.taxList = SalesPriceReportFormComponent._taxList;
    }

    /** Load and cache unit list */
    if (!SalesPriceReportFormComponent._unitList) {
      this.unitList = SalesPriceReportFormComponent._unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units')).map(tax => {
        tax['id'] = tax.Code;
        tax['text'] = tax.Name;
        return tax;
      });
    } else {
      this.taxList = SalesPriceReportFormComponent._taxList;
    }
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PurchaseVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    params['includeObject'] = true;
    params['includeDetails'] = true;
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  formLoad(formData: PurchaseVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PurchaseVoucherModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        itemFormData.Details.forEach(detail => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          newDetailFormGroup.get('Unit')['dataList'] = detail.Product['Units'];
          if (detail.ImageThumbnail) {
            newDetailFormGroup.get('Image')['thumbnail'] = detail.ImageThumbnail + '?token=' + this.apiService.getAccessToken();
          }
          const details = this.getDetails(newForm);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
          this.toMoney(newForm, newDetailFormGroup);
        });
      }

      // // Actions form load
      // if (itemFormData.Actions) {
      //   itemFormData.Actions.forEach(action => {
      //     const newActionFormGroup = this.makeNewActionFormGroup(action);
      //     this.getActions(index).push(newActionFormGroup);
      //     const comIndex = this.getActions(index).length - 1;
      //     this.onAddActionFormGroup(index, comIndex, newActionFormGroup);
      //   });
      // }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: PurchaseVoucherModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [{ disabled: true, value: '' }],
      Object: ['', Validators.required],
      ObjectName: [''],
      // Tax: [''],
      Title: [''],
      DateOfPurchase: [new Date()],
      Note: [''],
      PriceTable: [''],
      _total: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      // this.addDetailFormGroup(newForm);
    }
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
      this.router.navigate(['/sales/sales-voucher/list']);
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
    const newForm = this.formBuilder.group({
      Id: [''],
      // No: [''],
      // Type: [''],
      Product: [''],
      // ProductName: ['', Validators.required],
      Quantity: [1],
      Price: [0],
      SuggestedSalesPrice: [0],
      Unit: [''],
      // Tax: [''],
      ToMoney: [0],
      Image: [''],
      // Reason: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      // data.Price = parseFloat(data.Price) as any;
      newForm.patchValue(data);
    }
    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    // this.componentList[formGroupIndex].push([]);
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    this.getDetails(parentFormGroup).push(newChildFormGroup);
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
    // this.componentList[mainIndex].splice(index, 1);
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
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewActionFormGroup();
    this.getActions(formGroupIndex).push(newFormGroup);
    this.onAddActionFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeActionGroup(formGroupIndex: number, index: number) {
    this.getActions(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveActionFormGroup(formGroupIndex, index);
    return false;
  }
  onAddActionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveActionFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
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
          // formGroup.get('ObjectTaxCode').setValue(selectedData.TaxCode);
          // formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          // formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }

  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel) {
    console.log(selectedData);
    if (selectedData) {
      let defaultUnit = null;
      if (selectedData['Units']) {
        defaultUnit = selectedData['Units'].find((item: any) => item['Default'] === '1');
        if (defaultUnit) {
          detail.get('Unit')['dataList'] = selectedData['Units'].map((item: any) => ({ ...item, id: item['Code'], text: item['Name'] }));
          detail.get('Unit').patchValue({
            id: defaultUnit['Code'],
            text: defaultUnit['Name'],
            Code: defaultUnit['Code'],
            Name: defaultUnit['Name'],
            Symbol: defaultUnit['Name'],
          });
        }
      }
      // detail.get('ProductName').setValue(selectedData.Name);
      detail.get('Image').setValue(selectedData.FeaturePicture);
      detail.get('Image')['thumbnail'] = (selectedData.FeaturePictureThumbnail ? (selectedData.FeaturePictureThumbnail + '?token=' + this.apiService.getAccessToken()) : '');

    } else {
      // detail.get('ProductName').setValue('');
      detail.get('Unit').setValue('');
    }
    return false;
  }

  calculatToMoney(detail: FormGroup) {
    const toMoney = detail.get('Quantity').value * detail.get('Price').value;
    // let tax = detail.get('Tax').value;
    // if (tax) {
    //   if (typeof tax === 'string') {
    //     tax = this.taxList.filter(t => t.Code === tax)[0];
    //   }
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    return toMoney;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    // console.log('calculate to money: ' + (detail.get('Quantity').value * detail.get('Price').value));
    // let toMoney = detail.get('Quantity').value * detail.get('Price').value;
    // let tax = detail.get('Tax').value;
    // if (tax) {
    //   if (typeof tax === 'string') {
    //     tax = this.taxList.filter(t => t.Code === tax)[0];
    //   }
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    detail.get('ToMoney').setValue(this.calculatToMoney(detail));

    // Call culate total
    const details = this.getDetails(formItem);
    let total = 0;
    for (let i = 0; i < details.controls.length; i++) {
      total += this.calculatToMoney(details.controls[i] as FormGroup);
    }
    formItem.get('_total').setValue(total);
    return false;
  }


  preview(formItem: FormGroup) {
    const data: PurchaseVoucherModel = formItem.getRawValue();
    data.Details.forEach(detail => {
      if (typeof detail['Tax'] === 'string') {
        detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
      }
    });
    this.commonService.openDialog(PurchaseVoucherPrintComponent, {
      context: {
        title: 'Xem trước',
        data: data,
        onSaveAndClose: (priceReportCode: string) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (priceReportCode: string) => {
          this.save();
        },
      },
    });
    return false;
  }

}
