import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccBankModel } from '../../../../models/accounting.model';
import { ContactDetailModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-sync-profile-form',
  templateUrl: './sync-profile-form.component.html',
  styleUrls: ['./sync-profile-form.component.scss']
})
export class WordpressSyncProfileFormComponent extends DataManagerFormComponent<AccBankModel> implements OnInit {

  componentName: string = 'WordpressSyncProfileFormComponent';
  idKey = 'Code';
  baseFormUrl = '';
  apiPath = '/wordpress/wp-sync-profile';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<WordpressSyncProfileFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  select2OptionForSites: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/wordpress/wp-sites', { includeIdText: true }, {
      placeholder: 'Chọn sites...',
      limit: 10,
      prepareReaultItem: (item) => {
        item.text = `${item.Name} - ${item.Domain}`;
        return item;
      }
    }),
    multiple: true,
    allowClear: true,
  };

  select2OptionForCategories: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/categories', { includeIdText: true }, {
      placeholder: 'Chọn danh mục...',
      limit: 10,
      prepareReaultItem: (item) => {
        return item;
      }
    }),
    multiple: true,
    allowClear: true,
  };

  select2OptionForGroups = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/groups', { includeIdText: true }, {
      placeholder: 'Chọn nhóm...',
      limit: 10,
      prepareReaultItem: (item) => {
        return item;
      }
    }),
    multiple: true,
    allowClear: true,
  };

  select2OptionForProducts: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/products', { includeIdText: true }, {
      placeholder: 'Chọn sản phẩm...',
      limit: 10,
      prepareReaultItem: (item) => {
        return item;
      }
    }),
    multiple: true,
    allowClear: true,
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
  }

  async init(): Promise<boolean> {
    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue('');
          });
        });
      }
      return status;
    });
  }

  async formLoad(formData: AccBankModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: AccBankModel) => void) {
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
  executeGet(params: any, success: (resources: AccBankModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeOrganizations'] = true;
    params['includeGroups'] = true;
    params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: AccBankModel): FormGroup {
    const curentUrl = new URL(window.location.href); curentUrl.origin
    const newForm = this.formBuilder.group({
      Code: [''],
      Sites: ['', Validators.required],
      ProductGroups: [''],
      ProductCategories: [''],
      Products: [''],
      Schedule: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: AccBankModel): void {
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

  onAfterCreateSubmit(newFormData: AccBankModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: AccBankModel[]) {
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
