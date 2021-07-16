import { AccountModel, BusinessModel } from './../../../../../models/accounting.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../../lib/data-manager/data-manager-form.component';
import { CashVoucherModel, CashVoucherDetailModel } from '../../../../../models/accounting.model';
import { ContactModel } from '../../../../../models/contact.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { CashPaymentVoucherPrintComponent } from '../cash-payment-voucher-print/cash-payment-voucher-print.component';
import { Select2SelectionObject } from '../../../../../../vendor/ng2select2/lib/ng2-select2.interface';

@Component({
  selector: 'ngx-cash-payment-voucher-form',
  templateUrl: './cash-payment-voucher-form.component.html',
  styleUrls: ['./cash-payment-voucher-form.component.scss']
})
export class CashPaymentVoucherFormComponent extends DataManagerFormComponent<CashVoucherModel> implements OnInit {

  // Base variables
  componentName = 'CashPaymentVoucherFormComponent';
  idKey = 'Code';
  apiPath = '/accounting/cash-vouchers';
  baseFormUrl = '/accouting/cash-payment-voucher/form';

  // variables
  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  // numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  accountingBusinessList: BusinessModel[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CashPaymentVoucherFormComponent>,
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
  // select2DataForAccountingBusiness = [
  //   {
  //     id: 'PURCHASEPAYMENT',
  //     text: 'Trả tiền nhập hàng',
  //   },
  //   {
  //     id: 'DEBTPAYMENT',
  //     text: 'Trả tiền công nợ',
  //   },
  //   {
  //     id: 'CONTRACTPAYMENT',
  //     text: 'Trả tiền hợp đồng',
  //   },
  //   {
  //     id: 'SALARYPAYMENT',
  //     text: 'Trả tiền lương nhân viên',
  //   },
  //   {
  //     id: 'ADVANCES2EMPLOYEES',
  //     text: 'Tạm ứng cho nhân viên',
  //   },
  // ];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    // multiple: true,
    tags: true,
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
  select2ForAccount = {
    placeholder: 'Tài khản...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  select2ForReciprocalAccount = {
    placeholder: 'Tài khản đối ứng...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  accountList: AccountModel[] = [];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async formLoad(formData: CashVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CashVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Resources form load
      if (itemFormData.Details) {
        const details = this.getDetails(index);
        details.clear();
        itemFormData.Details.forEach(detail => {
          const newResourceFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newResourceFormGroup);
          const comIndex = details.length - 1;
          this.onAddDetailFormGroup(index, comIndex, newResourceFormGroup);
        });
      }

      this.toMoney(newForm);

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  async init() {
    this.accountList = await this.apiService.getPromise<AccountModel[]>('/accounting/accounts', {}).then(rs => rs.map(account => {
      account['id'] = account.Code;
      account['text'] = account.Code + ' - ' + account.Name;
      return account;
    }));
    this.accountingBusinessList = await this.apiService.getPromise<AccountModel[]>('/accounting/business', { eq_Type: 'PAYMENT' }).then(rs => rs.map(accBusiness => {
      accBusiness['id'] = accBusiness.Code;
      accBusiness['text'] = accBusiness.Name;
      return accBusiness;
    }));
    return super.init().then(rs => {
      this.getRequestId(id => {
        if (!id || id.length === 0) {
          this.addDetailFormGroup(0);
        }
        // else {
        //   for (const mainForm of this.array.controls) {
        //     this.toMoney(mainForm as FormGroup);
        //   }
        // }
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
      this.prepareRestrictedData(newForm, data);
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
      DebitAccount: ['', Validators.required],
      CreditAccount: ['', Validators.required],
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
      item['Type'] = 'PAYMENT';
    }
    return data;
  }

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          const data = {
            ObjectName: selectedData.Name,
            ObjectPhone: selectedData.Phone,
            ObjectEmail: selectedData.Email,
            ObjectAddress: selectedData.Address,
            ObjectTaxCode: selectedData.TaxCode,
            // ObjectBankName: selectedData.BankName,
            // ObjectBankCode: selectedData.BankAcc,
          };

          this.prepareRestrictedData(formGroup, data);
          formGroup.patchValue(data);
        } else {
          formGroup.patchValue({
            ObjectName: selectedData['text'],
          });
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


  preview(formItem: FormGroup) {
    const data: CashVoucherModel = formItem.value;
    data.Details.forEach(detail => {
      // if (typeof detail['Tax'] === 'string') {
      //   detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
      // }
    });
    this.commonService.openDialog(CashPaymentVoucherPrintComponent, {
      context: {
        title: 'Xem trước',
        data: [data],
        onSaveAndClose: (rs: CashVoucherModel) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (rs: CashVoucherModel) => {
          this.save();
        },
      },
    });
    return false;
  }

  onAccBusinessChange(detail: FormGroup, business: BusinessModel, index: number) {
    detail.get('DebitAccount').setValue(business.DebitAccount);
    detail.get('CreditAccount').setValue(business.CreditAccount);
    detail.get('Description').setValue(business.Description);
  }

}
