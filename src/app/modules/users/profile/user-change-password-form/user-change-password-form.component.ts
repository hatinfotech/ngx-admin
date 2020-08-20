import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { UserModel } from '../../../../models/user.model';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserPhoneExtensionModel } from '../../../../models/user-phone-extension.model';

@Component({
  selector: 'ngx-user-change-password-form',
  templateUrl: './user-change-password-form.component.html',
  styleUrls: ['./user-change-password-form.component.scss'],
})
export class UserChangePasswordFormComponent extends DataManagerFormComponent<UserModel> implements OnInit {

  componentName: string = 'UserChangePasswordFormComponent';
  idKey = 'Code';
  apiPath = '/user/profiles';
  baseFormUrl = '/users/profile/change-password';

  groupList: UserGroupModel[];
  select2OptionForGroups = {
    placeholder: 'Chọn nhóm...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
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
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** Remove close button */
    const closeBtn = this.actionButtonList.filter(btn => btn.name === 'close')[0];
    closeBtn.label = commonService.textTransform(commonService.translate.instant('Common.goback'), 'head-title');
    closeBtn.icon = 'arrow-back';
    closeBtn.status = 'primary';

  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    this.formLoad();
    // this.id = [this.commonService.loginInfo.user.Code];
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(['CURRENT']);
  }

  /** Execute api get */
  // executeGet(params: any, success: (resources: UserModel[]) => void, error?: (e: HttpErrorResponse) => void) {
  //   params['includeUserPhoneExtensions'] = true;
  //   super.executeGet(params, success, error);
  // }

  /** Get form data by id from api */
  getFormData(callback: (data: UserModel[]) => void) {
    this.apiService.get<UserModel[]>(this.apiPath, { id: this.id, multi: true, includeGroups: true, includeUserPhoneExtensions: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  async formLoad(formData?: UserModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: UserModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Resources form load
      if (itemFormData.UserPhoneExtensions) itemFormData.UserPhoneExtensions.forEach(phoneExt => {
        const phoneExtFormGroup = this.makeNewUserPhoneExtensionFormGroup(phoneExt);
        (newForm.get('UserPhoneExtensions') as FormArray).push(phoneExtFormGroup);

      });

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  makeNewFormGroup(data?: UserModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Phone: ['', Validators.required],
      Email: ['', Validators.required],
      Password: [''],
      RePassword: [''],

      UserPhoneExtensions: this.formBuilder.array([

      ]),
    }, { validator: this.checkPasswords });
    if (data) {
      data[this.idKey + '_old'] = data.Code;
      // data['Groups'] = data['Groups'].map(item => {
      //   return item.Code;
      // });
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewUserPhoneExtensionFormGroup(data?: UserPhoneExtensionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Extension: ['', Validators.required],
      Host: ['', Validators.required],
      Port: ['', Validators.required],
      Domain: ['', Validators.required],
      Password: ['', Validators.required],
      Transport: [''],
      DisplayName: ['', Validators.required],
    });

    if (data) {
      // data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    return newForm;
  }

  getUserPhoneExtensions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('UserPhoneExtensions') as FormArray;
  }

  addUserPhoneExtensionFormGroup(formGroupIndex: number) {
    this.getUserPhoneExtensions(formGroupIndex).push(this.makeNewUserPhoneExtensionFormGroup());
    return false;
  }

  removeUserPhoneExtensionGroup(formGroupIndex: number, index: number) {
    this.getUserPhoneExtensions(formGroupIndex).removeAt(index);
    return false;
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.Password.value;
    const confirmPass = group.controls.RePassword.value;

    return !pass || pass === confirmPass ? null : { notSame: true };
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: UserModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void { }
  goback(): false {
    this.router.navigate(['/']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api post */
  executePost(params: any, data: UserModel[], success: (data: UserModel[]) => void, error: (e: any) => void) {
    throw Error('Tính năng bị chặn');
  }
}
