import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { PurchasePriceTableModel, PurchasePriceTableDetailModel } from '../../../../models/purchase.model';
import { environment } from '../../../../../environments/environment';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
// import { SalesPriceReportFormComponent } from '../../../sales/price-report/sales-price-report-form/sales-price-report-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
// import { PurchasePriceTablePrintComponent } from '../purchase-price-table-print/purchase-price-table-print.component';
import * as XLSX from 'xlsx';
import { CurrencyMaskConfig } from 'ng2-currency-mask';

@Component({
  selector: 'ngx-purchase-price-table-form',
  templateUrl: './purchase-price-table-form.component.html',
  styleUrls: ['./purchase-price-table-form.component.scss'],
})
export class PurchasePriceTableFormComponent extends DataManagerFormComponent<PurchasePriceTableModel> implements OnInit {

  componentName: string = 'PurchasePriceTableFormComponent';
  idKey = 'Code';
  apiPath = '/purchase/price-tables';
  baseFormUrl = '/purchase/price-table/form';

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = { prefix: '', suffix: ' ' + this.locale[15], thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };
  numberFormat: CurrencyMaskConfig = { prefix: '', suffix: '', thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };
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
    // multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '' }).then(rs => {
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
    public ref: NbDialogRef<PurchasePriceTableFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
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
      // url: params => {
      //   return this.apiService.buildApiUrl('/admin-product/products', { includeUnit: true, 'filter_Name': params['term'] });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/admin-product/products', { includeUnit: true, 'filter_Name': params['term'] }).then(rs => {
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
            item['text'] = item['Name'];
            return item;
          }),
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
    // ajax: {
    //   url: params => {
    //     return this.apiService.buildApiUrl('/admin-product/units', { 'filter_Name': params['term'] });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     // console.info(data, params);
    //     return {
    //       results: data.map(item => {
    //         item['id'] = item['Code'];
    //         item['text'] = item['Name'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
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
    // multiple: false,
    // ajax: {
    //   url: params => {
    //     return this.apiService.buildApiUrl('/accounting/taxes', { 'filter_Name': params['term'] });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     // console.info(data, params);
    //     return {
    //       results: data.map(item => {
    //         item['id'] = item['Code'];
    //         item['text'] = item['Name'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
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
    // if (!SalesPriceReportFormComponent._taxList) {
    // } else {
    //   this.taxList = SalesPriceReportFormComponent._taxList;
    // }

    /** Load and cache unit list */
    this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', {limit: 'nolimit'})).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    // if (!SalesPriceReportFormComponent._unitList) {
    // } else {
    //   this.taxList = SalesPriceReportFormComponent._taxList;
    // }
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PurchasePriceTableModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeDetails'] = true;
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: PurchasePriceTableModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PurchasePriceTableModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        itemFormData.Details.forEach(condition => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, condition);
          const details = this.getDetails(newForm);
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

  makeNewFormGroup(data?: PurchasePriceTableModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Supplier: [''],
      SupplierName: [''],
      SupplierEmail: [''],
      SupplierPhone: [''],
      SupplierAddress: [''],
      Recipient: [''],
      SupplierTaxCode: [''],
      DirectReceiverName: [''],
      SupplierBankName: [''],
      SupplierBankCode: [''],
      PaymentStep: [''],
      DeliveryAddress: [''],
      Title: [''],
      Description: [''],
      DateOfApprove: [''],
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
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PurchasePriceTableModel): void {
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
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: PurchasePriceTableDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      No: [''],
      Type: [''],
      Product: [''],
      Description: ['', Validators.required],
      Quantity: [1],
      Price: [0],
      Unit: [''],
      Tax: [''],
      ToMoney: [0],
      Image: [''],
      Reason: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
      // this.toMoney(parentFormGroup, newForm);
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
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) { }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) { }
  /** End Detail Form */

  onSupplierChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        if (selectedData.Code) {
          formGroup.get('SupplierName').setValue(selectedData.Name);
          formGroup.get('SupplierPhone').setValue(selectedData.Phone);
          formGroup.get('SupplierEmail').setValue(selectedData.Email);
          formGroup.get('SupplierAddress').setValue(selectedData.Address);
          formGroup.get('SupplierTaxCode').setValue(selectedData.TaxCode);
          formGroup.get('SupplierBankName').setValue(selectedData.BankName);
          formGroup.get('SupplierBankCode').setValue(selectedData.BankAcc);
        }
      }
    }

  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel) {
    console.log(selectedData);
    if (selectedData) {
      detail.get('Description').setValue(selectedData.Name);
      if (selectedData.WarehouseUnit && selectedData.WarehouseUnit.Code) {
        detail.get('Unit').patchValue({
          id: selectedData.WarehouseUnit['Code'],
          text: selectedData.WarehouseUnit['Name'],
          Code: selectedData.WarehouseUnit['Code'],
          Name: selectedData.WarehouseUnit['Name'],
          Symbol: selectedData.WarehouseUnit['Symbol'],
        });
      }
    } else {
      detail.get('Description').setValue('');
      detail.get('Unit').setValue('');
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
    const details = this.getDetails(formItem);
    let total = 0;
    for (let i = 0; i < details.controls.length; i++) {
      total += this.calculatToMoney(details.controls[i] as FormGroup);
    }
    formItem.get('_total').setValue(total);
    return false;
  }

  async preview(formItem: FormGroup) {
    const data: PurchasePriceTableModel = formItem.value;
    data.Details.forEach(detail => {
      if (typeof detail['Tax'] === 'string') {
        detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
      }
    });
    // this.commonService.openDialog(PurchasePriceTablePrintComponent, {
    //   context: {
    //     title: 'Xem trước',
    //     data: data,
    //     onSaveAndClose: (priceReportCode: string) => {
    //       this.saveAndClose();
    //     },
    //     onSaveAndPrint: (priceReportCode: string) => {
    //       this.save();
    //     },
    //   },
    // });
    return false;
  }

  willDownload = false;
  onFileChange(ev: any, formItem: FormGroup) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const priceTableSheet = jsonData[' HDCVI CAMERA'];
      // new Promise(resolve => {
        for (let i = 0; i < priceTableSheet.length; i++) {
          const row = priceTableSheet[i];
          if (row['Thông số kỹ thuật'] && row['Giá Sỉ\n ( VND)']) {
            const newDetail = this.makeNewDetailFormGroup(formItem, {
              Description: row['Thông số kỹ thuật'],
              Price: row['Giá Sỉ\n ( VND)'],
            });
            const details = this.getDetails(formItem);
            details.push(newDetail);
            await new Promise(resolve => setTimeout(() => resolve(true), 50));
          }
        }
      //   resolve();
      // });



      // const dataString = JSON.stringify(jsonData);
      // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat('...');
      // this.setDownload(dataString);
    };
    reader.readAsBinaryString(file);
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector('#download');
      el.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute('download', 'xlsxtojson.json');
    }, 1000);
  }

}
