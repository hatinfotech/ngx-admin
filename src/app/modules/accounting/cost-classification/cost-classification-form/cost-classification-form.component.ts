import { filter, takeUntil } from 'rxjs/operators';
import { SalesVoucherPrintComponent } from '../../../sales/sales-voucher/sales-voucher-print/sales-voucher-print.component';
import { SalesVoucherModel } from '../../../../models/sales.model';
import { SalesVoucherListComponent } from '../../../sales/sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccBankAccountModel, AccountModel, BusinessModel, CostClassificationModel } from '../../../../models/accounting.model';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccCostClassificationPrintComponent } from '../cost-classification-print/cost-classification-print.component';
import { TaxModel } from '../../../../models/tax.model';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { AccBusinessFormComponent } from '../../acc-business/acc-business-form/acc-business-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { CollaboratorOrderModel } from '../../../../models/collaborator.model';
import { RootServices } from '../../../../services/root.services';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';

@Component({
  selector: 'ngx-cost-classification-form',
  templateUrl: './cost-classification-form.component.html',
  styleUrls: ['./cost-classification-form.component.scss']
})
export class AccCostClassificationFormComponent extends DataManagerFormComponent<CostClassificationModel> implements OnInit {

  // Base variables
  componentName = 'AccCostClassificationFormComponent';
  idKey = 'Code';
  baseFormUrl = '/accouting/cost-classification/form';
  apiPath = '/accounting/cost-classifications';
  // previewAfterSave = true;
  previewAfterCreate = true;
  printDialog = AccCostClassificationPrintComponent;

  // variables
  locale = this.cms.getCurrentLoaleDataset();
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<AccCostClassificationFormComponent>,
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

  costClassificationList: CostClassificationModel[];
  select2OptionForParent = {
    placeholder: 'Khoản mục cha...',
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
  select2OptionForAccModel = {
    ...this.cms.select2OptionForTemplate,
    placeholder: 'Mô hình kế toán...',
    data: [
      { id: 'TT200', text: 'Thông tư 200' },
      { id: 'TT133', text: 'Thông tư 133' },
    ],
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async formLoad(formData: CostClassificationModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CostClassificationModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {
      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  async init() {
    return super.init().then(async rs => {
      this.costClassificationList = await this.apiService.getPromise<CostClassificationModel[]>(this.apiPath, { includeIdText: true, sort_Name: 'asc', limit: 'nolimit' }).then(rs => rs.map(m => {
        m.text = `${m.id} - ${m.text} (${this.cms.getObjectText(m.AccModel)})`;
        return m;
      }));
      return rs;
    });
  }

  makeNewFormGroup(data?: CostClassificationModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [null, Validators.required],
      Parent: [null],
      Name: [null, Validators.required],
      Description: [null],
      AccModel: ['TT200'],
    });
    if (data) {
      newForm.patchValue(data);
    }

    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: CostClassificationModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // this.resourceList.push([]);
  }
  onRemoveFormGroup(index: number): void {
    // this.resourceList.splice(index, 1);
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api get */
  executeGet(params: any, success: (resources: CostClassificationModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    return super.executeGet(params, success, error);
  }

  // Orverride
  getRawFormData() {
    const data = super.getRawFormData();
    return data;
  }

}
