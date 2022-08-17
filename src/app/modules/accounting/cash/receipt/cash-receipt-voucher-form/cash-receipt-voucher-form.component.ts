import { filter, takeUntil } from 'rxjs/operators';
import { SalesVoucherPrintComponent } from './../../../../sales/sales-voucher/sales-voucher-print/sales-voucher-print.component';
import { SalesVoucherModel } from './../../../../../models/sales.model';
import { SalesVoucherListComponent } from './../../../../sales/sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../../lib/data-manager/data-manager-form.component';
import { AccBankAccountModel, AccountModel, BusinessModel, CashVoucherDetailModel, CashVoucherModel } from '../../../../../models/accounting.model';
import { ContactModel } from '../../../../../models/contact.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { CashReceiptVoucherPrintComponent } from '../cash-receipt-voucher-print/cash-receipt-voucher-print.component';
import { TaxModel } from '../../../../../models/tax.model';
import { CustomIcon, FormGroupComponent } from '../../../../../lib/custom-element/form/form-group/form-group.component';
import { AccBusinessFormComponent } from '../../../acc-business/acc-business-form/acc-business-form.component';
import { ContactFormComponent } from '../../../../contact/contact/contact-form/contact-form.component';

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
  // previewAfterSave = true;
  previewAfterCreate = true;
  printDialog = CashReceiptVoucherPrintComponent;

  // variables
  locale = this.commonService.getCurrentLoaleDataset();
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0 };
  // numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  accountDebitList: AccountModel[] = [];
  accountCreditList: AccountModel[] = [];
  accountList: AccountModel[] = [];
  accountingBusinessList: BusinessModel[] = [];
  bankAccountList: AccBankAccountModel[] = [];

  customIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Accounting.Business.label'), status: 'success', action: (formGroupCompoent:FormGroupComponent, detailFormGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(AccBusinessFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          data: [{ Type: 'RECEIPT' }],
          onDialogSave: (newAccBusiness: BusinessModel[]) => {
            console.log(newAccBusiness);
            const accBusiness: any = { ...newAccBusiness[0], id: newAccBusiness[0].Code, text: newAccBusiness[0].Name };
            detailFormGroup.get('AccountingBusiness').patchValue(accBusiness);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

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

  // select2OptionForContact = {
  //   placeholder: 'Chọn liên hệ...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   // multiple: true,
  //   tags: false,
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
  //           item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
  //           return item;
  //         }),
  //       };
  //     },
  //   },
  // };

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

  select2OptionForBankAccounting = {
    placeholder: this.commonService.translateText('Common.bankAccount'),
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
  };

  objectControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewContact'), status: 'success', action: (formGroupCompoent:FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          data: [{ Groups: [{ id: 'CONTACT', text: this.commonService.translateText('Common.contact') }] }],
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
    }
  }];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async formLoad(formData: CashVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CashVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Resources form load
      if (itemFormData?.Details) {
        const details = this.getDetails(newForm);
        details.clear();
        itemFormData.Details.forEach(detail => {
          const newResourceFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newResourceFormGroup);
          const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, comIndex, newResourceFormGroup);
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
    this.bankAccountList = await this.apiService.getPromise<AccBankAccountModel[]>('/accounting/bank-accounts', { limit: 'nolimit', select: "id=>Code,text=>CONCAT(Owner;'/';AccountNumber;'/';Bank;'/';Branch)" });
    this.accountList = await this.apiService.getPromise<AccountModel[]>('/accounting/accounts', { limit: 'nolimit' }).then(rs => rs.map(account => {
      account['id'] = account.Code;
      account['text'] = account.Code + ' - ' + account.Name;
      return account;
    }));
    this.accountDebitList = this.accountList.filter(f => f.Group == 'CASH');
    this.accountCreditList = this.accountList.filter(f => f.Group != 'CASH');
    this.accountingBusinessList = await this.apiService.getPromise<AccountModel[]>('/accounting/business', { limit: 'nolimit', eq_Type: 'RECEIPT' }).then(rs => rs.map(accBusiness => {
      accBusiness['id'] = accBusiness.Code;
      accBusiness['text'] = accBusiness.Name;
      return accBusiness;
    }));
    return super.init().then(rs => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Description').setValue('Copy of: ' + formItem.get('Description').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue('');
          });
        });
      }
      return rs;
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: CashVoucherModel[]) => void) {
    this.apiService.get<CashVoucherModel[]>(this.apiPath, { id: this.id, eq_Type: 'RECEIPT', multi: true, includeDetails: true, includeContact: true, includeRelativeVouchers: true },
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
      Object: ['', Validators.required],
      ObjectName: ['', Validators.required],
      ObjectPhone: [''],
      ObjectEmail: [''],
      ObjectAddress: [''],
      ObjectTaxCode: [''],
      // Currency: ['VND', Validators.required],
      DateOfVoucher: [null, Validators.required],
      RelativeVouchers: [''],
      BankAccount: [''],
      Details: this.formBuilder.array([]),
      _total: [''],
    });
    if (data) {
      data[this.idKey + '_old'] = data.Code;
      this.prepareRestrictedData(newForm, data);
      const accoutnGroup = this.commonService.getObjectId(data.BankAccount) ? 'CASHINBANK' : 'CASH';
      newForm['debitAccounts'] = this.accountList.filter(f => f.Group === accoutnGroup);
      newForm.patchValue(data);
    } else {
      newForm['debitAccounts'] = this.accountList.filter(f => f.Group === 'CASH');
      this.addDetailFormGroup(newForm);
    }

    const titleControl = newForm.get('Description');
    newForm.get('ObjectName').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(objectName => {
      if (objectName && (!titleControl.touched || !titleControl.value) && (!titleControl.value || /^Thu tiền: /.test(titleControl.value))) {
        titleControl.setValue(`Thu tiền: ${objectName}`);
      }
    });

    newForm.get('DateOfVoucher').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(dateOfPurchase => {
      if (dateOfPurchase) {
        this.commonService.lastVoucherDate = dateOfPurchase;
      }
    });

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
    params['includeRelativeVouchers'] = true;
    return super.executeGet(params, success, error);
  }

  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: CashVoucherDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      SystemUuid: [''],
      AccountingBusiness: [''],
      Description: ['', Validators.required],
      RelateCode: [''],
      DebitAccount: ['1111', Validators.required],
      CreditAccount: ['', Validators.required],
      Amount: ['', Validators.required],
    });

    if (data) {
      newForm.patchValue(data);
      // this.toMoney(parentFormGroup, newForm);
    }
    return newForm;
  }

  getDetails(parentFormGroup: FormGroup) {
    if (!parentFormGroup) return null;
    return parentFormGroup.get('Details') as FormArray;
  }

  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    const details = this.getDetails(parentFormGroup);
    details.push(newFormGroup);
    this.onAddDetailFormGroup(parentFormGroup, details.length - 1, newFormGroup);
    return false;
  }

  onAddDetailFormGroup(parentFormGroup: FormGroup, index: number, newFormGroup: FormGroup) {
  }

  removeDetail(formGroup: FormGroup, index: number) {
    this.getDetails(formGroup).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveDetailFormGroup(formGroup, index);
    return false;
  }

  onRemoveDetailFormGroup(parentFormGroup: FormGroup, index: number) {
    // this.resourceList[mainIndex].splice(index, 1);
    this.toMoney(parentFormGroup);
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

  onBankAccountChange(formGroup: FormGroup, selectedData: AccountModel) {
    // console.info(item);
    if (!this.isProcessing) {
      if (selectedData && selectedData.id) {
        formGroup['debitAccounts'] = this.accountList.filter(f => f.Group === 'CASHINBANK');
      } else {
        formGroup['debitAccounts'] = this.accountList.filter(f => f.Group === 'CASH');
      }
      const details = this.getDetails(formGroup);
      for (const detail of details.controls) {
        detail.get('DebitAccount').setValue(formGroup['debitAccounts'] && formGroup['debitAccounts'].length > 0 ? formGroup['debitAccounts'][0] : null);
      }
    }

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


  // async preview(formItem: FormGroup) {
  //   const data: CashVoucherModel = formItem.value;
  //   this.commonService.openDialog(CashReceiptVoucherPrintComponent, {
  //     context: {
  //       title: 'Xem trước',
  //       data: [data],
  //       idKey: ['Code'],
  //       onSaveAndClose: (rs: CashVoucherModel) => {
  //         this.saveAndClose();
  //       },
  //       onSaveAndPrint: (rs: CashVoucherModel) => {
  //         this.save();
  //       },
  //     },
  //   });
  //   return false;
  // }

  onAccBusinessChange(detail: FormGroup, business: BusinessModel, index: number) {
    if (!this.isProcessing) {
      if (business?.DebitAccount) detail.get('DebitAccount').setValue(business.DebitAccount);
      if (business?.CreditAccount) detail.get('CreditAccount').setValue(business.CreditAccount);
      const descriptionControl: FormControl = detail.get('Description') as FormControl;
      if (business?.Name && (!descriptionControl.value || this.accountingBusinessList.findIndex(f => f.Name === descriptionControl.value) > -1))
        detail.get('Description').setValue(business.Name);
    }
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.commonService.openDialog(SalesVoucherListComponent, {
      context: {
        inputMode: 'dialog',
        onDialogChoose: async (chooseItems: SalesVoucherModel[]) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          // const insertList = [];
          this.onProcessing();
          for (let i = 0; i < chooseItems.length; i++) {
            await this.addRelativeVoucher(chooseItems[i], 'SALES', formGroup);
          }
          
          setTimeout(() => {
            this.onProcessed();
          }, 1000);
          // relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'SALES' }))]);
        },
        onDialogClose: () => {
        },
      }
    })
    return false;
  }

  async addRelativeVoucher(relativeVoucher: any, relativeVoucherType: string, formGroup?: FormGroup) {
    if (!formGroup) {
      formGroup = this.array.controls[0] as FormGroup;
    }
    const insertList = [];
    const relationVoucher = formGroup.get('RelativeVouchers');
    const relationVoucherValue: any[] = (relationVoucher.value || []);
    if (relationVoucherValue.some(s => s.id == relativeVoucher.Code)) {
      this.commonService.toastService.show('Chứng từ liên quan đã được thêm vào trước đó', 'Thông báo', { status: 'warning' });
      return;
    }
    const index = Array.isArray(relationVoucherValue) ? relationVoucherValue.findIndex(f => f?.id === relativeVoucher?.Code) : -1;
    if (index < 0) {
      const details = this.getDetails(formGroup);
      // get purchase order
      let salesVoucher;
      switch (relativeVoucherType) {
        case 'SALES':
          salesVoucher = await this.apiService.getPromise<SalesVoucherModel[]>('/sales/sales-vouchers/' + relativeVoucher.Code, { includeObject: true, includeDetails: true }).then(rs => rs[0]);
          break;
        default:
          return false;
      }

      if (this.commonService.getObjectId(salesVoucher.State) != 'APPROVED') {
        this.commonService.toastService.show(this.commonService.translateText('Phiếu bán hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
        return false;
      }
      if (this.commonService.getObjectId(formGroup.get('Object').value)) {
        if (this.commonService.getObjectId(salesVoucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
          this.commonService.toastService.show(this.commonService.translateText('Khách hàng trong phiếu bán hàng không giống với phiếu bán hàng'), this.commonService.translateText('Common.warning'), { status: 'warning' });
          return false;
        }
      } else {
        delete salesVoucher.Id;
        delete salesVoucher.Code;
        formGroup.patchValue({ ...salesVoucher, Id: null, Details: [] });
        formGroup.get('Description').patchValue('Thu tiền cho ' + salesVoucher.Title);
        details.clear();
      }

      // insertList.push(chooseItems[i]);

      // Insert order details into voucher details
      if (salesVoucher?.Details) {
        // details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu đặt mua hàng: ' + purchaseVoucher.Code + ' - ' + purchaseVoucher.Title }));
        let totalMoney = 0;
        const taxList = await this.apiService.getPromise<TaxModel[]>('/accounting/taxes', { select: 'id=>Code,text=>Name,Tax=>Tax' })
        for (const voucherDetail of salesVoucher.Details) {
          if (voucherDetail.Type !== 'CATEGORY') {
            const tax = this.commonService.getObjectId(voucherDetail.Tax) ? taxList.find(f => f.id == this.commonService.getObjectId(voucherDetail.Tax))['Tax'] : null;
            totalMoney += voucherDetail.Price * voucherDetail.Quantity + (tax ? ((voucherDetail.Price * tax / 100) * voucherDetail.Quantity) : 0);
          }
        }
        const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, {
          AccountingBusiness: 'RECEIPTCUSTOMERDEBT',
          Description: salesVoucher.Title,
          DebitAccount: '1111',
          CreditAccount: '131',
          Amount: totalMoney,
          Id: null,
        });
        details.push(newDtailFormGroup);
      }
    }
    insertList.push(relativeVoucher);
    relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'SALES' }))]);
    return relativeVoucher;
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
  