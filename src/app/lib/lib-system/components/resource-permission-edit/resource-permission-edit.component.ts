import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ActionControlListOption } from '../../../custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../data-manager/data-manager-form.component';
import { Model } from '../../../../models/model';

export class PermissionModel {
  User?: string;
  Permissions?: string[];
}

export class ResourceModel extends Model {
  Permission?: PermissionModel[];
}

@Component({
  selector: 'ngx-resource-permission-edit',
  templateUrl: './resource-permission-edit.component.html',
  styleUrls: ['./resource-permission-edit.component.scss']
})
export class ResourcePermissionEditComponent<M extends ResourceModel> extends DataManagerFormComponent<M> implements OnInit {

  // Base variables
  componentName = 'ResourcePermissionEditComponent';
  @Input() idKey = 'Code';
  @Input() apiPath: string;
  @Input() resourceName: string;
  @Input() note = '';
  // @Input() resrouce: M;
  baseFormUrl = '/accouting/cash-receipt-voucher/form';

  idKeys?: string[];

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
    public ref: NbDialogRef<ResourcePermissionEditComponent<M>>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'save',
      status: 'primary',
      label: this.commonService.textTransform(this.commonService.translate.instant('Common.save'), 'head-title'),
      icon: 'save',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.save'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        // this.preview(option.form);
        this.saveAndClose();
      },
    });
    const saveBtn = this.actionButtonList.find(f => f.name === 'close');
    saveBtn && (saveBtn.label = 'ESC');
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

  ngOnInit() {
    this.restrict();
    if (Array.isArray(this.idKey)) {
      this.idKeys = this.idKey;
    } else {
      this.idKeys = [this.idKey];
    }
    this.id = this.inputId;
    super.ngOnInit();
  }

  async formLoad(formData: M[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: M) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Resources form load
      if (itemFormData.Permission) {
        const details = this.getPermission(index);
        details.clear();
        itemFormData.Permission.forEach(detail => {
          const newResourceFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newResourceFormGroup);
          const comIndex = details.length - 1;
          this.onAddDetailFormGroup(index, comIndex, newResourceFormGroup);
        });
      }

      // this.toMoney(newForm);

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
  // getFormData(callback: (data: M[]) => void) {
  //   this.apiService.get<M[]>(this.apiPath, { id: this.id, multi: true, includePermission: true, includeContact: true },
  //     data => callback(data),
  //   ), (e: HttpErrorResponse) => {
  //     this.onError(e);
  //   };
  // }


  select2OptionForUser = {
    placeholder: this.commonService.translateText('Common.chooseSomething', { something: this.commonService.translateText('Common.user') }),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    // tags: true,
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/user/users', {filter_Name: params['term'], onlyIdText: true });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data,
        };
      },
    },
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  select2OptionForPms = {
    placeholder: this.commonService.translateText('Common.chooseSomething', { something: this.commonService.translateText('Common.permission') }),
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  pmsList = [
    { id: 'V', text: this.commonService.translateText('Common.Pms.view') },
    { id: 'L', text: this.commonService.translateText('Common.Pms.list') },
    { id: 'E', text: this.commonService.translateText('Common.Pms.edit') },
    { id: 'D', text: this.commonService.translateText('Common.Pms.delete') },
    { id: 'M', text: this.commonService.translateText('Common.Pms.manage') },
    { id: 'P', text: this.commonService.translateText('Common.Pms.print') },
  ];

  makeNewFormGroup(data?: M): FormGroup {
    const formGroupDefinition = {};
    if (Array.isArray(this.idKey)) {
      for (const key of this.idKey) {
        formGroupDefinition[key] = [''];
      }
    } else {
      formGroupDefinition[this.idKey] = [''];
    }
    formGroupDefinition['Permission'] = this.formBuilder.array([]);
    const newForm = this.formBuilder.group(formGroupDefinition);
    if (data) {
      if(!data['Permission']) {
        data['Permission'] = [];
      }
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: M): void {
    super.onAddFormGroup(index, newForm, formData);
    // this.resourceList.push([]);
  }
  onRemoveFormGroup(index: number): void {
    // this.resourceList.splice(index, 1);
  }
  goback(): false {
    super.goback();
    // if (this.mode === 'page') {
    //   this.router.navigate(['/accounting/cash-receipt-voucher/list']);
    // } else {
    this.ref.close();
    // this.onDialogClose();
    // this.dismiss();
    // }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api get */
  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includePermission'] = true;
    params['select'] = this.idKeys.join(',') + ',' + 'Permission';
    return super.executeGet(params, success, error);
  }

  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: PermissionModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Id: [''],
      User: ['', Validators.required],
      Permissions: ['', Validators.required],
    });

    if (data) {
      newForm.patchValue(data);
      // this.toMoney(parentFormGroup, newForm);
    }
    return newForm;
  }

  getPermission(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Permission') as FormArray;
  }

  addDetailFormGroup(formGroupIndex: number) {
    const newFormGroup = this.makeNewDetailFormGroup(this.array.controls[formGroupIndex] as FormGroup);
    this.getPermission(formGroupIndex).push(newFormGroup);
    this.onAddDetailFormGroup(formGroupIndex, this.getPermission(formGroupIndex).length - 1, newFormGroup);
    return false;
  }

  onAddDetailFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  }

  removeDetail(formGroupIndex: number, index: number) {
    this.getPermission(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveDetailFormGroup(formGroupIndex, index);
    return false;
  }

  onRemoveDetailFormGroup(mainIndex: number, index: number) {
    // this.resourceList[mainIndex].splice(index, 1);
    // this.toMoney(this.array.controls[mainIndex] as FormGroup);
  }

  // Orverride
  getRawFormData() {
    const data = super.getRawFormData();
    // for (const item of data.array) {
    //   item['Type'] = 'RECEIPT';
    // }
    return data;
  }

  // onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
  //   // console.info(item);

  //   if (!this.isProcessing) {
  //     if (selectedData && !selectedData['doNotAutoFill']) {

  //       // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
  //       if (selectedData.Code) {
  //         formGroup.get('ObjectName').setValue(selectedData.Name);
  //         formGroup.get('ObjectPhone').setValue(selectedData.Phone);
  //         formGroup.get('ObjectEmail').setValue(selectedData.Email);
  //         formGroup.get('ObjectAddress').setValue(selectedData.Address);
  //         formGroup.get('ObjectTaxCode').setValue(selectedData.TaxCode);
  //         formGroup.get('ObjectBankName').setValue(selectedData.BankName);
  //         formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
  //       }
  //     }
  //   }
  // }

  // onChangeCurrency(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

  // }

  // toMoney(formItem: FormGroup) {
  //   // detail.get('ToMoney').setValue(this.calculatToMoney(detail));
  //   this.commonService.takeUntil(this.componentName + '_toMoney', 300).then(rs => {
  //     // Call culate total
  //     const details = formItem.get('Permission') as FormArray;
  //     let total = 0;
  //     for (const detail of details.controls) {
  //       // total += this.calculatToMoney(details.controls[i] as FormGroup);
  //       total += parseInt(detail.get('Amount').value || 0);

  //     }
  //     formItem.get('_total').setValue(total);
  //   });
  //   return false;
  // }


  // preview(formItem: FormGroup) {
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

  restrict() {
    return true;
  }

}
