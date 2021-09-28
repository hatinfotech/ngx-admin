import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccountModel, BusinessModel, CashVoucherDetailModel } from '../../../../models/accounting.model';
import { CollaboratorAwardVoucherModel } from '../../../../models/collaborator.model';
import { ContactModel } from '../../../../models/contact.model';
import { SalesVoucherModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccountingOtherBusinessVoucherFormComponent } from '../../../accounting/other-business-voucher/accounting-other-business-voucher-form/accounting-other-business-voucher-form.component';
import { AccountingOtherBusinessVoucherPrintComponent } from '../../../accounting/other-business-voucher/accounting-other-business-voucher-print/accounting-other-business-voucher-print.component';
import { SalesVoucherListComponent } from '../../../sales/sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { CollaboratorService } from '../../collaborator.service';
import { CollaboartorAwardDetailComponent } from './collaboartor-award-detail/collaboartor-award-detail.component';

@Component({
  selector: 'ngx-collaborator-award-form',
  templateUrl: './collaborator-award-form.component.html',
  styleUrls: ['./collaborator-award-form.component.scss']
})
export class CollaboratorAwardFormComponent extends DataManagerFormComponent<CollaboratorAwardVoucherModel> implements OnInit {

  // Base variables
  componentName = 'AccountingOtherBusinessVoucherFormComponent';
  idKey = 'Code';
  baseFormUrl = '/collaborator/award-voucher/form';
  apiPath = '/collaborator/award-vouchers';

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
    public ref: NbDialogRef<AccountingOtherBusinessVoucherFormComponent>,
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
    placeholder: 'Chọn cộng tác viên...',
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
        return this.apiService.buildApiUrl('/collaborator/publishers', { onlyIdText: true, filter_Name: params['term'] });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data,
        };
      },
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

  async formLoad(formData: CollaboratorAwardVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CollaboratorAwardVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
        // this.onAddFormGroup(index, newForm, itemFormData);
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
  getFormData(callback: (data: CollaboratorAwardVoucherModel[]) => void) {
    this.apiService.get<CollaboratorAwardVoucherModel[]>(this.apiPath, { id: this.id, multi: true, includeDetails: true, includeContact: true, includeRelativeVouchers: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: CollaboratorAwardVoucherModel): FormGroup {
    const loggedUser = this.commonService?.loginInfo$?.value?.user;

    const newForm = this.formBuilder.group({
      Code: [''],
      Page: [this.collaboratorService.currentpage$.value, Validators.required],
      Publisher: [''],
      PublisherName: [''],
      PublisherPhone: [''],
      PublisherEmail: [''],
      PublisherAddress: [''],
      PublisherIdentifiedNumber: [''],
      PublisherBankName: [''],
      PublisherBankAccount: [''],
      Amount: ['', Validators.required],
      ToDate: [new Date(), Validators.required],
      Description: [`Kết chuyển hoa hồng đến ngày ${new Date().toLocaleDateString()}`, Validators.required],
    });
    if (data) {
      this.prepareRestrictedData(newForm, data);
      newForm.patchValue(data);
    }

    return newForm;
  }

  onConditionFieldsChange(newForm) {
    const awardRange = newForm.get('ToDate').value;
    console.log(awardRange);
    const publisherEle = newForm.get('Publisher');
    const publisher = this.commonService.getObjectId(publisherEle.value);
    const publisherName = newForm.get('PublisherName').value;
    if (!this.isProcessing && publisher) {
      const page = this.commonService.getObjectId(newForm.get('Page').value);
      const amountEle = newForm.get('Amount');
      const descriptionEle = newForm.get('Description');

      const dateRange = awardRange;
      const fromDate = dateRange && dateRange[0] && (new Date(dateRange[0].getFullYear(), dateRange[0].getMonth(), dateRange[0].getDate(), 0, 0, 0)).toISOString() || null;
      const toDate = dateRange && dateRange[1] && new Date(dateRange[1].getFullYear(), dateRange[1].getMonth(), dateRange[1].getDate(), 23, 59, 59).toISOString() || null;

      this.apiService.getPromise<any>('/collaborator/statistics', { summaryReport: 'COMMISSION', page: page, publisher: publisher, toDate: toDate, limit: 'nolimit' }).then(summaryReport => {
        console.log(summaryReport);
        amountEle.setValue(summaryReport?.AwardAmount);
        descriptionEle.setValue(`Kết chuyển hoa hồng đến ngày ${awardRange && awardRange[1] && awardRange[1].toLocaleDateString()}`);
      });
      setTimeout(() => {
        // newForm['listInstance'] && newForm['listInstance'].refresh();
        this.refreshAllTab(newForm);
      }, 500);
    }
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: CollaboratorAwardVoucherModel): void {
    super.onAddFormGroup(index, newForm, formData);
    setTimeout(() => {
      newForm.get('ToDate').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(awardRange => {
        // console.log(awardRange);
        this.onConditionFieldsChange(newForm);
      });
      newForm.get('Publisher').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(publisher => {
        this.onConditionFieldsChange(newForm);
      });
      newForm.get('Page').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(publisher => {
        this.onConditionFieldsChange(newForm);
      });
    }, 3000);
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
  executeGet(params: any, success: (resources: CollaboratorAwardVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
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

    setTimeout(() => {
      // formGroup['listInstance'] && formGroup['listInstance'].refresh();
      this.refreshAllTab(formGroup);
    }, 500);
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
    const data: CollaboratorAwardVoucherModel = formItem.value;
    this.commonService.openDialog(AccountingOtherBusinessVoucherPrintComponent, {
      context: {
        title: 'Xem trước',
        data: [data],
        idKey: ['Code'],
        onSaveAndClose: (rs: CollaboratorAwardVoucherModel) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (rs: CollaboratorAwardVoucherModel) => {
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

  onListInit(listInstance: CollaboartorAwardDetailComponent, formGroup: FormGroup, tab: string) {
    console.log(listInstance);
    if (!formGroup['listInstance']) {
      formGroup['listInstance'] = {};
    }
    formGroup['listInstance'][tab] = listInstance;
  }

  refreshAllTab(formGroup: FormGroup) {
    if (formGroup['listInstance']) {
      for (const tabName in formGroup['listInstance']) {
        formGroup['listInstance'][tabName].refresh();
      }
    }
  }

  isShowDetail(formGroup: FormGroup) {
    return formGroup.get('Page').value && formGroup.get('Publisher').value && formGroup.get('ToDate').value;
  }

}
