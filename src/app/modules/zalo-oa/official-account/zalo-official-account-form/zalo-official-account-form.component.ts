import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ZaloOaOfficialAccountModel } from '../../../../models/zalo-oa.model';
import { ContactDetailTypeModel, ContactDetailModel } from '../../../../models/contact.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { ZaloOaFollowerFormComponent } from '../../follower/zalo-oa-follower-form/zalo-oa-follower-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-zalo-official-account-form',
  templateUrl: './zalo-official-account-form.component.html',
  styleUrls: ['./zalo-official-account-form.component.scss'],
})
export class ZaloOfficialAccountFormComponent extends DataManagerFormComponent<ZaloOaOfficialAccountModel> implements OnInit {

  componentName: string = 'ZaloOfficialAccountFormComponent';
  idKey = 'Code';
  baseFormUrl = '/zalo-oa/official-account/form';
  apiPath = '/zalo-oa/official-accounts';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<ZaloOfficialAccountFormComponent>,
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
    return super.init();
  }

  async formLoad(formData: ZaloOaOfficialAccountModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ZaloOaOfficialAccountModel) => void) {
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
  executeGet(params: any, success: (resources: ZaloOaOfficialAccountModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeOrganizations'] = true;
    params['includeGroups'] = true;
    params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: ZaloOaOfficialAccountModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Description: [''],
      AppId: ['', Validators.required],
      AppSecret: ['', Validators.required],
      OaId: ['', Validators.required],
      CallbackUrl: ['', Validators.required],
      ApiUrl: ['', Validators.required],
      Status: [true],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ZaloOaOfficialAccountModel): void {
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

  onAfterCreateSubmit(newFormData: ZaloOaOfficialAccountModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: ZaloOaOfficialAccountModel[]) {
    super.onAfterUpdateSubmit(newFormData);
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
