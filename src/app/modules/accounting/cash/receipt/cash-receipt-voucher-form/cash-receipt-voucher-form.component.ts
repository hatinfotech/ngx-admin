import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { DataManagerFormComponent } from '../../../../../lib/data-manager/data-manager-form.component';
import { CashVoucherDetailModel, CashVoucherModel } from '../../../../../models/accounting.model';
import { ContactModel } from '../../../../../models/contact.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'ngx-cash-receipt-voucher-form',
  templateUrl: './cash-receipt-voucher-form.component.html',
  styleUrls: ['./cash-receipt-voucher-form.component.scss']
})
export class CashReceiptVoucherFormComponent extends DataManagerFormComponent<CashVoucherModel> implements OnInit {

  // Base variables
  componentName = 'CashReceiptVoucherFormComponent';
  idKey = 'Code';
  apiPath = '/accounting/cash-vouchers';
  baseFormUrl = '/accouting/cash-receipt-voucher/form';

  // variables
  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  // numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CashReceiptVoucherFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   if (this.mode === 'page') {
  //     super.getRequestId(callback);
  //   } else {
  //     callback(this.inputId);
  //   }
  // }

  select2OptionForContact = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
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

  // Currency list
  currencyList = [
    {
      id: 'VND',
      text: 'Việt Nam đồng (VND)',
    },
    {
      id: 'USD',
      text: 'Đô la mỹ (USD)',
    },
  ];
  select2OptionForCurrencyList = {
    placeholder: 'Currency...',
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
  };

  // Accounting Business Option
  select2DataForAccountingBusiness = [
    {
      id: 'SALESRECEIPT',
      text: 'Thu tiền bán hàng',
    },
    {
      id: 'DEBTRECEIPT',
      text: 'Thu tiền công nợ',
    },
    {
      id: 'CONTRACTRECEIPT',
      text: 'Thu tiền hợp đồng',
    },
  ];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  roles: { id: string, text: string }[] = [
    {
      id: 'MANAGER',
      text: 'Manager',
    },
    {
      id: 'MEMBER',
      text: 'Member',
    },
  ];
  select2OptionForRoles = {
    placeholder: 'Chọn nhóm vai trò...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };


  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async formLoad(formData: CashVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CashVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Resources form load
      if (itemFormData.Details) {
        itemFormData.Details.forEach(detail => {
          const newResourceFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          this.getDetails(index).push(newResourceFormGroup);
          const comIndex = this.getDetails(index).length - 1;
          this.onAddDetailFormGroup(index, comIndex, newResourceFormGroup);
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  async init() {
    return super.init().then(rs => {
      this.getRequestId(id => {
        if (!id || id.length === 0) {
          this.addDetailFormGroup(0);
        } else {
          for (const mainForm of this.array.controls) {
            this.toMoney(mainForm as FormGroup);
          }
        }
      });
      return rs;
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: CashVoucherModel[]) => void) {
    this.apiService.get<CashVoucherModel[]>(this.apiPath, { id: this.id, multi: true, includeDetails: true, includeContact: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: CashVoucherModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Description: ['', Validators.required],
      RelatedUserName: [''],
      DateOfImplement: [''],
      Object: [''],
      ObjectName: [''],
      ObjectPhone: [''],
      ObjectEmail: [''],
      ObjectAddress: [''],
      ObjectTaxCode: [''],
      Currency: ['VND', Validators.required],
      RelationVoucher: [''],
      Details: this.formBuilder.array([]),
      _total: [''],
    });
    if (data) {
      data[this.idKey + '_old'] = data.Code;
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: CashVoucherModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // this.resourceList.push([]);
  }
  onRemoveFormGroup(index: number): void {
    // this.resourceList.splice(index, 1);
  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/accounting/cash-receipt-voucher/list']);
    } else {
      this.ref.close();
      // this.onDialogClose();
      // this.dismiss();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api get */
  executeGet(params: any, success: (resources: CashVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeDetails'] = true;
    params['includeContact'] = true;
    return super.executeGet(params, success, error);
  }

  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: CashVoucherDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      AccountingBusiness: [''],
      Description: ['', Validators.required],
      RelateCode: [''],
      Amount: ['', Validators.required],
    });

    if (data) {
      newForm.patchValue(data);
      // this.toMoney(parentFormGroup, newForm);
    }
    return newForm;
  }

  getDetails(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Details') as FormArray;
  }

  addDetailFormGroup(formGroupIndex: number) {
    const newFormGroup = this.makeNewDetailFormGroup(this.array.controls[formGroupIndex] as FormGroup);
    this.getDetails(formGroupIndex).push(newFormGroup);
    this.onAddDetailFormGroup(formGroupIndex, this.getDetails(formGroupIndex).length - 1, newFormGroup);
    return false;
  }

  onAddDetailFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  }

  removeDetail(formGroupIndex: number, index: number) {
    this.getDetails(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveDetailFormGroup(formGroupIndex, index);
    return false;
  }

  onRemoveDetailFormGroup(mainIndex: number, index: number) {
    // this.resourceList[mainIndex].splice(index, 1);
    this.toMoney(this.array.controls[mainIndex] as FormGroup);
  }

  // Orverride
  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      item['Type'] = 'RECEIPT';
    }
    return data;
  }

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

  onChangeCurrency(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

  }

  toMoney(formItem: FormGroup) {
    // detail.get('ToMoney').setValue(this.calculatToMoney(detail));
    this.commonService.takeUntil(this.componentName + '_toMoney', 300).then(rs => {
      // Call culate total
      const details = formItem.get('Details') as FormArray;
      let total = 0;
      for (const detail of details.controls) {
        // total += this.calculatToMoney(details.controls[i] as FormGroup);
        total += parseInt(detail.get('Amount').value || 0);

      }
      formItem.get('_total').setValue(total);
    });
    return false;
  }

}
