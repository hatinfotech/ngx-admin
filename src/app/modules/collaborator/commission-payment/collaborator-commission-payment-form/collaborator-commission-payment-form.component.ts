import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { takeUntil } from 'rxjs/operators';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccountModel, BusinessModel } from '../../../../models/accounting.model';
import { CollaboratorCommissionVoucherModel } from '../../../../models/collaborator.model';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccountingOtherBusinessVoucherPrintComponent } from '../../../accounting/other-business-voucher/accounting-other-business-voucher-print/accounting-other-business-voucher-print.component';
import { CollaboratorService } from '../../collaborator.service';

@Component({
  selector: 'ngx-collaborator-commission-payment-form',
  templateUrl: './collaborator-commission-payment-form.component.html',
  styleUrls: ['./collaborator-commission-payment-form.component.scss']
})
export class CollaboratorCommissionPaymentFormComponent extends DataManagerFormComponent<CollaboratorCommissionVoucherModel> implements OnInit {

  // Base variables
  componentName = 'CollaboratorCommissionPaymentFormComponent';
  idKey = 'Code';
  baseFormUrl = '/collaborator/commission-voucher/form';
  apiPath = '/collaborator/commission-payment-vouchers';

  // variables
  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  // numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  // accountDebitList: AccountModel[] = [];
  // accountCreditList: AccountModel[] = [];
  accountList: AccountModel[] = [];
  accountingBusinessList: BusinessModel[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CollaboratorCommissionPaymentFormComponent>,
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
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { includeIdText: true, filter_Name: params['term'] });
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
  //     id: 'SALESRECEIPT',
  //     text: 'Thu tiền bán hàng',
  //   },
  //   {
  //     id: 'DEBTRECEIPT',
  //     text: 'Thu tiền công nợ',
  //   },
  //   {
  //     id: 'CONTRACTRECEIPT',
  //     text: 'Thu tiền hợp đồng',
  //   },
  // ];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
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
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2ForDebitAccount = {
    placeholder: 'Tài khản nợ...',
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
  select2ForCreditAccount = {
    placeholder: 'Tài khản có...',
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


  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async formLoad(formData: CollaboratorCommissionVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CollaboratorCommissionVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  async init() {
    // this.accountList = await this.apiService.getPromise<AccountModel[]>('/accounting/accounts', {limit: 'nolimit'}).then(rs => rs.map(account => {
    //   account['id'] = account.Code;
    //   account['text'] = account.Code + ' - ' + account.Name;
    //   return account;
    // }));
    // this.accountDebitList = this.accountList;
    // this.accountCreditList = this.accountList;
    // this.accountingBusinessList = await this.apiService.getPromise<AccountModel[]>('/accounting/business', { limit: 'nolimit' }).then(rs => rs.map(accBusiness => {
    //   accBusiness['id'] = accBusiness.Code;
    //   accBusiness['text'] = accBusiness.Name;
    //   return accBusiness;
    // }));
    return super.init().then(rs => {
      // this.getRequestId(id => {
      //   if (!id || id.length === 0) {
      //     this.addDetailFormGroup(0);
      //   }
      //   // else {
      //   //   for (const mainForm of this.array.controls) {
      //   //     this.toMoney(mainForm as FormGroup);
      //   //   }
      //   // }
      // });
      return rs;
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: CollaboratorCommissionVoucherModel[]) => void) {
    this.apiService.get<CollaboratorCommissionVoucherModel[]>(this.apiPath, { id: this.id, multi: true, includeDetails: true, includeContact: true, includeRelativeVouchers: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: CollaboratorCommissionVoucherModel): FormGroup {
    const loggedUser = this.commonService?.loginInfo$?.value?.user;

    const newForm = this.formBuilder.group({
      Code: [''],
      Page: [this.collaboratorService.currentpage$.value, Validators.required],
      // RelatedUserName: [''],
      ObjectName: [loggedUser && loggedUser.Name || ''],
      ObjectPhone: [loggedUser && loggedUser.Phone || ''],
      ObjectEmail: [loggedUser && loggedUser.Email || ''],
      ObjectAddress: [''],
      ObjectIdentifiedNumber: [''],
      ObjectBankName: [''],
      ObjectBankAccount: [''],
      Amount: ['', Validators.required],
      DateOfVoucher: [new Date(), Validators.required],
      Description: [`Yêu cầu thanh toán tiền hoa hồng đến ngày ${new Date().toLocaleDateString()} cho ${loggedUser.Name}`, Validators.required],
    });
    if (data) {
      this.prepareRestrictedData(newForm, data);
      newForm.patchValue(data);
    }
    newForm.get('DateOfVoucher').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (!this.isProcessing) {
        const page = this.commonService.getObjectId(newForm.get('Page').value);
        const amountEle = newForm.get('Amount');
        const descriptionEle = newForm.get('Description');
        this.apiService.getPromise<any>('/collaborator/statistics', { summaryReport: 'COMMISSION', page: page, toDate: value && value.toISOString(), limit: 'nolimit' }).then(summaryReport => {
          console.log(summaryReport);
          amountEle.setValue(summaryReport?.CommissionAmount);
          descriptionEle.setValue(`Yêu cầu thanh toán tiền hoa hồng đến ngày ${value && value.toLocaleDateString()} cho ${loggedUser.Name}`);
        });
      }
    });
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: CollaboratorCommissionVoucherModel): void {
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
  executeGet(params: any, success: (resources: CollaboratorCommissionVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeDetails'] = true;
    params['includeContact'] = true;
    // params['includeRelativeVouchers'] = true;
    return super.executeGet(params, success, error);
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
    const data: CollaboratorCommissionVoucherModel = formItem.value;
    this.commonService.openDialog(AccountingOtherBusinessVoucherPrintComponent, {
      context: {
        title: 'Xem trước',
        data: [data],
        idKey: ['Code'],
        onSaveAndClose: (rs: CollaboratorCommissionVoucherModel) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (rs: CollaboratorCommissionVoucherModel) => {
          this.save();
        },
      },
    });
    return false;
  }

  onAccBusinessChange(detail: FormGroup, business: BusinessModel, index: number) {
    if (!this.isProcessing) {
      detail.get('DebitAccount').setValue(business.DebitAccount);
      detail.get('CreditAccount').setValue(business.CreditAccount);
      detail.get('Description').setValue(business.Description);
    }
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
    // if (relativeVocher && relativeVocher.type == 'SALES') {
    //   this.commonService.openDialog(SalesVoucherPrintComponent, {
    //     context: {
    //       showLoadinng: true,
    //       title: 'Xem trước',
    //       id: [this.commonService.getObjectId(relativeVocher)],
    //       // data: data,
    //       idKey: ['Code'],
    //       // approvedConfirm: true,
    //       onClose: (data: SalesVoucherModel) => {
    //         this.refresh();
    //       },
    //     },
    //   });
    // }
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.commonService.getObjectId(relativeVocher)));
    return false;
  }

}
