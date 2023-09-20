import { ZaloOaTemplateModel, ZaloOaTemplateParameterModel } from './../../../../models/zalo-oa.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { CashVoucherModel } from '../../../../models/accounting.model';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CashReceiptVoucherPrintComponent } from '../../../accounting/cash/receipt/cash-receipt-voucher-print/cash-receipt-voucher-print.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-zalo-oa-template-form',
  templateUrl: './zalo-oa-template-form.component.html',
  styleUrls: ['./zalo-oa-template-form.component.scss']
})
export class ZaloOaTemplateFormComponent extends DataManagerFormComponent<ZaloOaTemplateModel> implements OnInit {

  // Base variables
  componentName = 'ZaloOaTemplateFormComponent';
  idKey = 'Code';
  apiPath = '/zalo-oa/templates';
  baseFormUrl = '/zalo-oa/template/form';

  // variables
  locale = this.cms.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.cms.getCurrencyMaskConfig();
  // numberFormat: CurrencyMaskConfig = this.cms.getNumberMaskConfig();

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<ZaloOaTemplateFormComponent>,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

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

  // getRequestId(callback: (id?: string[]) => void) {
  //   if (this.mode === 'page') {
  //     super.getRequestId(callback);
  //   } else {
  //     callback(this.inputId);
  //   }
  // }

  select2OptionForZaloOaId = {
    placeholder: this.cms.translateText('ZaloOa.Oa.name') + '...',
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
      // url: params => {
      //   return this.apiService.buildApiUrl('/zalo-oa/official-accounts', { filter_Name: params['term'], select: 'id=>Code,text=>Name' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/zalo-oa/official-accounts', { filter_Name: params['term'], select: 'id=>Code,text=>Name' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            // item['id'] = item['id'] ?: item['Code'];
            // item['text'] = item['text'] ?: item['Name'];
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
    placeholder: this.cms.translateText('Common.dataType') + '...',
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

  async formLoad(formData: ZaloOaTemplateModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ZaloOaTemplateModel) => void) {
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

      this.toMoney(newForm);

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
  getFormData(callback: (data: ZaloOaTemplateModel[]) => void) {
    this.apiService.get<ZaloOaTemplateModel[]>(this.apiPath, { id: this.id, multi: true, includeDetails: true, includeContact: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: ZaloOaTemplateModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Description: [''],
      ZaloOa: ['', Validators.required],
      TemplateId: ['', Validators.required],
      Details: this.formBuilder.array([]),
      _total: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ZaloOaTemplateModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // this.resourceList.push([]);
  }
  onRemoveFormGroup(index: number): void {
    // this.resourceList.splice(index, 1);
  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      // this.router.navigate(['/accounting/cash-receipt-voucher/list']);
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
  executeGet(params: any, success: (resources: ZaloOaTemplateModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeDetails'] = true;
    // params['includeContact'] = true;
    return super.executeGet(params, success, error);
  }

  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: ZaloOaTemplateParameterModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Name: ['', Validators.required],
      TypeOfData: ['STRING', Validators.required],
      Format: [''],
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
    this.cms.takeUntil(this.componentName + '_toMoney', 300).then(rs => {
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


  async preview(formItem: FormGroup) {
    const data: CashVoucherModel = formItem.value;
    this.cms.openDialog(CashReceiptVoucherPrintComponent, {
      context: {
        title: 'Xem trước',
        data: [data],
        idKey: ['Code'],
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

}
