import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ContactDetailModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-acc-account-form',
  templateUrl: './acc-account-form.component.html',
  styleUrls: ['./acc-account-form.component.scss']
})
export class AccAccountFormComponent extends DataManagerFormComponent<AccountModel> implements OnInit {

  componentName: string = 'AccAccountFormComponent';
  idKey = 'Code';
  baseFormUrl = '/accounting/account/form';
  apiPath = '/accounting/accounts';

  reportByObjectList: { id: string, text: string }[] = [];
  reportByObjectSelect2Option = {
    placeholder: this.commonService.translateText('Accounting.reportByObject') + '...',
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

  accountPropertyList: { id: string, text: string }[] = [];
  accountTypeListSelect2Option = {
    placeholder: this.commonService.translateText('Accounting.property') + '...',
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

  currencyList: { id: string, text: string }[] = [];
  currencyListSelect2Option = {
    placeholder: this.commonService.translateText('Accounting.property') + '...',
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

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<AccAccountFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
  }

  async init() {
    await this.commonService.waitForLanguageLoaded();
    this.reportByObjectList = [
      {
        id: '',
        text: this.commonService.translateText('Common.none'),
      },
      {
        id: 'CUSTOMER',
        text: this.commonService.translateText('Common.customer'),
      },
      {
        id: 'SUPPLIER',
        text: this.commonService.translateText('Common.supplier'),
      },
      {
        id: 'EMPLOYEE',
        text: this.commonService.translateText('Common.employee'),
      },
    ];
    this.accountPropertyList = [
      {
        id: 'DEBIT',
        text: this.commonService.translateText('Accounting.debit'),
      },
      {
        id: 'CREDIT',
        text: this.commonService.translateText('Accounting.credit'),
      },
      {
        id: 'BOTH',
        text: this.commonService.translateText('Accounting.both'),
      },
    ];
    this.currencyList = [
      {
        id: 'VND',
        text: this.commonService.translateText('Common.Currency.Vnd.label'),
      },
      {
        id: 'USD',
        text: this.commonService.translateText('Common.Currency.Usd.label'),
      },
    ];
    return super.init();
  }

  async formLoad(formData: AccountModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: AccountModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // if (itemFormData.Details) {
      //   itemFormData.Details.forEach(detail => {
      //     const newUnitConversionFormGroup = this.makeNewDetailFormGroup(detail);
      //     this.getDetails(newForm).push(newUnitConversionFormGroup);
      //     const comIndex = this.getDetails(newForm).length - 1;
      //     this.onAddDetailFormGroup(newForm, comIndex, newUnitConversionFormGroup);
      //   });
      // }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   callback(this.inputId);
  // }

  /** Execute api get */
  executeGet(params: any, success: (resources: AccountModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeOrganizations'] = true;
    params['includeGroups'] = true;
    params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: AccountModel): FormGroup {
    const curentUrl = new URL(window.location.href); curentUrl.origin
    const newForm = this.formBuilder.group({
      Code: ['', Validators.required],
      Name: ['', Validators.required],
      Description: [''],
      Currency: ['VND', Validators.required],
      Property: ['', Validators.required],
      Group: [''],
      ReportByObject: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: AccountModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/contact/contact/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAfterCreateSubmit(newFormData: AccountModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: AccountModel[]) {
    return super.onAfterUpdateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }

  dismiss() {
    this.ref.close();
  }

  /** Details Form */
  makeNewDetailFormGroup(data?: ContactDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: [''],
      Detail: [''],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  getDetails(formItem: FormGroup) {
    return formItem.get('Details') as FormArray;
  }
  addDetailFormGroup(formItem: FormGroup) {
    const newFormGroup = this.makeNewDetailFormGroup();
    this.getDetails(formItem).push(newFormGroup);
    this.onAddDetailFormGroup(formItem, this.getDetails(formItem).length - 1, newFormGroup);
    return false;
  }
  removeDetailGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getDetails(parentForm).removeAt(index);
    this.onRemoveDetailFormGroup(formItem, index);
    return false;
  }
  onAddDetailFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
  }
  onRemoveDetailFormGroup(formItem: FormGroup, index: number) {
  }
  /** End Details Form */
}
