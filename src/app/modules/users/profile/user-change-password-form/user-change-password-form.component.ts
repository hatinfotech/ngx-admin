import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { UserModel } from '../../../../models/user.model';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-user-change-password-form',
  templateUrl: './user-change-password-form.component.html',
  styleUrls: ['./user-change-password-form.component.scss']
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
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
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

  /** Get form data by id from api */
  getFormData(callback: (data: UserModel[]) => void) {
    this.apiService.get<UserModel[]>(this.apiPath, { id: this.id, multi: true, includeGroups: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: UserModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Phone: ['', Validators.required],
      Email: ['', Validators.required],
      Password: [''],
      RePassword: [''],
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
