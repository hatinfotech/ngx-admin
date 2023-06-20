import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccountModel, BusinessModel } from '../../../../models/accounting.model';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccountingOtherBusinessVoucherPrintComponent } from '../../../accounting/other-business-voucher/accounting-other-business-voucher-print/accounting-other-business-voucher-print.component';
import { CollaboratorService } from '../../collaborator.service';
import { CollaboartorCommissionDetailComponent } from './collaboartor-commission-detail/collaboartor-commission-detail.component';
import { CollaboratorCommissionVoucherModel } from '../../../../models/collaborator.model';
import { IGetRowsParams } from 'ag-grid-community';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { ColDef } from '@ag-grid-community/core';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgNumberCellRenderer } from '../../../../lib/custom-element/ag-list/cell/number.component';
import { AgCurrencyCellRenderer } from '../../../../lib/custom-element/ag-list/cell/currency.component';

@Component({
  selector: 'ngx-collaborator-commission-form',
  templateUrl: './collaborator-commission-form.component.html',
  styleUrls: ['./collaborator-commission-form.component.scss']
})
export class CollaboratorCommissionFormComponent extends DataManagerFormComponent<CollaboratorCommissionVoucherModel> implements OnInit {

  // Base variables
  componentName = 'CollaboratorCommissionFormComponent';
  idKey = 'Code';
  baseFormUrl = '/collaborator/commission-voucher/form';
  apiPath = '/collaborator/commission-vouchers';

  // variables
  locale = this.cms.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.cms.getCurrencyMaskConfig();
  accountList: AccountModel[] = [];
  accountingBusinessList: BusinessModel[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<CollaboratorCommissionFormComponent>,
    public collaboratorService: CollaboratorService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'print',
      status: 'primary',
      label: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.preview(option.form);
      },
    });
  }

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

  commissionColumnDefs: ColDef[] = [
    {
      ...agMakeSelectionColDef(this.cms),
      headerName: 'STT',
      // width: 52,
      field: 'Id',
      valueGetter: 'node.data.Product',
      // cellRenderer: 'loadingCellRenderer',
      // sortable: true,
      // pinned: 'left',
    },
    {
      headerName: 'Sản phẩm',
      field: 'Description',
      cellRenderer: AgTextCellRenderer,
      width: 300,
      sortable: false,
      filter: 'agTextColumnFilter',
      // pinned: 'left',
    },
    {
      headerName: 'ĐVT',
      field: 'ProductUnit',
      cellRenderer: AgTextCellRenderer,
      width: 120,
      sortable: false,
      filter: 'agTextColumnFilter',
      // pinned: 'left',
    },
    {
      headerName: 'SL bán',
      field: 'SumOfQuantity',
      cellRenderer: AgNumberCellRenderer,
      width: 100,
      sortable: false,
      filter: 'agTextColumnFilter',
      // pinned: 'left',
    },
    {
      headerName: 'Doanh số',
      field: 'SumOfNetRevenue',
      cellRenderer: AgCurrencyCellRenderer,
      width: 150,
      sortable: false,
      filter: 'agTextColumnFilter',
      // pinned: 'left',
    },
    {
      headerName: 'Chiết khấu',
      field: 'CommissionAmount',
      cellRenderer: AgCurrencyCellRenderer,
      width: 150,
      sortable: false,
      filter: 'agTextColumnFilter',
      // pinned: 'left',
    },
  ]

  // commissionData = {
  //   rowCount: null,
  //   getRows: async (getRowParams: IGetRowsParams) => {
  //     this.apiService.getPromise<{ id: number, text: string }[]>('/collaborator/statistics', { tempCommissionReport: true, limit: 'nolimit', offset: getRowParams.startRow, page: this.cms.getObjectId(this.array.controls[0].get('Page').value), publisher: this.cms.getObjectId(this.array.controls[0].get('Publisher').value), moment: this.array.controls[0].get('CommissionTo').value }).then((rs) => {
  //       let lastRow = -1;
  //       if (rs.length < 40) {
  //         lastRow = getRowParams.startRow + rs.length;
  //       }
  //       getRowParams.successCallback(rs, lastRow);
  //       return rs;
  //     });
  //   },
  // };

  onGridChange(event, data) {

  }

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
    return super.init().then(rs => {
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
    const loggedUser = this.cms?.loginInfo$?.value?.user;

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
      // Cycle: [],
      Amount: { value: '', disabled: true },
      CommissionTo: [new Date(), Validators.required],
      Description: [`Kết chuyển chiết khấu đến ngày ${new Date().toLocaleDateString()}`, Validators.required],

      CommissionStatictis: [[]],
    });
    if (data) {
      this.prepareRestrictedData(newForm, data);
      newForm.patchValue(data);
    }

    return newForm;
  }

  onConditionFieldsChange(newForm: FormGroup) {
    const awardRange = newForm.get('CommissionTo').value;
    console.log(awardRange);
    const publisherEle = newForm.get('Publisher');
    const publisher = this.cms.getObjectId(publisherEle.value);
    const publisherName = newForm.get('PublisherName').value;
    newForm.get('Description').setValue(`Kết chuyển chiết khấu đến ngày ${newForm.get('CommissionTo')?.value?.toLocaleDateString()}`);
    if (!this.isProcessing && publisher) {
      setTimeout(() => {
        // newForm['listInstance'] && newForm['listInstance'].refresh();
        this.refreshAllTab(newForm);
      }, 500);
    }
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: CollaboratorCommissionVoucherModel): void {
    super.onAddFormGroup(index, newForm, formData);
    setTimeout(() => {
      newForm.get('CommissionTo').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(awardRange => {
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
  }
  onRemoveFormGroup(index: number): void {
  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/accounting/cash-receipt-voucher/list']);
    } else {
      this.ref.close();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api get */
  executeGet(params: any, success: (resources: CollaboratorCommissionVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    return super.executeGet(params, success, error);
  }

  // Orverride
  getRawFormData() {
    const data = super.getRawFormData();
    return data;
  }

  commissionData = [];
  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        if (selectedData.Code) {
          const data = {
            ObjectName: selectedData.Name,
            ObjectPhone: selectedData.Phone,
            ObjectEmail: selectedData.Email,
            ObjectAddress: selectedData.Address,
            ObjectTaxCode: selectedData.TaxCode,
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

    setTimeout(async () => {
      // this.refreshAllTab(formGroup);
      this.commissionData = await this.apiService.getPromise<{ id: number, text: string }[]>('/collaborator/statistics', { tempCommissionReport: true, limit: 'nolimit', page: this.cms.getObjectId(this.array.controls[0].get('Page').value), publisher: this.cms.getObjectId(this.array.controls[0].get('Publisher').value), moment: this.array.controls[0].get('CommissionTo').value }).then((rs) => {
        return rs;
      });
    }, 500);
  }

  onChangeCurrency(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

  }

  toMoney(formItem: FormGroup) {
    this.cms.takeUntil(this.componentName + '_toMoney', 300).then(rs => {
      // Call culate total
      const details = formItem.get('Details') as FormArray;
      let total = 0;
      for (const detail of details.controls) {
        total += parseInt(detail.get('Amount').value || 0);

      }
      formItem.get('_total').setValue(total);
    });
    return false;
  }

  async preview(formItem: FormGroup) {
    const data: CollaboratorCommissionVoucherModel = formItem.value;
    this.cms.openDialog(AccountingOtherBusinessVoucherPrintComponent, {
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
    if (relativeVocher) this.cms.previewVoucher(relativeVocher.type, relativeVocher);
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.cms.getObjectId(relativeVocher)));
    return false;
  }

  onListInit(listInstance: CollaboartorCommissionDetailComponent, formGroup: FormGroup, tab: string) {
    console.log(listInstance);
    if (!formGroup['listInstance']) {
      formGroup['listInstance'] = {};
    }
    formGroup['listInstance'][tab] = listInstance;
  }

  updateTotalCommission(totalAawrd: number, formGroup: FormGroup, tab: string) {
    formGroup.get('Amount').setValue(totalAawrd);
  }

  refreshAllTab(formGroup: FormGroup) {
    if (formGroup['listInstance']) {
      for (const tabName in formGroup['listInstance']) {
        formGroup['listInstance'][tabName].refresh();
      }
    }
  }

  isShowDetail(formGroup: FormGroup) {
    return formGroup.get('Page').value && formGroup.get('Publisher').value && formGroup.get('CommissionTo').value;
  }

}
