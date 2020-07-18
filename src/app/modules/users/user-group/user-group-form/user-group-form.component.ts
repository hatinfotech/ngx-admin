import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { UserModel } from '../../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ngx-user-group-form',
  templateUrl: './user-group-form.component.html',
  styleUrls: ['./user-group-form.component.scss'],
})
export class UserGroupFormComponent extends DataManagerFormComponent<UserGroupModel> implements OnInit {

  componentName = 'UserGroupFormComponent';
  idKey = 'Code';
  apiPath = '/user/groups';
  baseFormUrl = '/users/group/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<UserGroupFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   if (this.mode === 'page') {
  //     super.getRequestId(callback);
  //   } else {
  //     callback(this.inputId);
  //   }
  // }

  userList: UserModel[];
  select2OptionForUsers = {
    placeholder: 'Thêm người dùng...',
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

  parentList: UserGroupModel[];
  select2OptionForParent = {
    placeholder: 'Chọn nhóm cha...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Description',
    },
  };

  ngOnInit() {
    this.restrict();
    this.apiService.get<UserGroupModel[]>(
      '/user/groups', { limit: 99999 },
      list1 => {
        list1.unshift({
          Code: '',
          Description: 'Chọn nhóm cha...',
        });
        this.parentList = list1.map(item => {
          item['id'] = item['Code'];
          item['text'] = item['Description'];
          return item;
        });

        this.apiService.get<UserModel[]>('/user/users', { limit: 9999999, isMulti: true, select: 'Code,Name' },
          list => {
            this.userList = list.filter((item: UserModel) => {
              if (item['Code'] && item['Name']) {
                // item['User'] = item['Code'];
                item['id'] = item['Code'];
                item['text'] = item['Name'];
                return true;
              }
              return false;
            });
            super.ngOnInit();
          });

      });


  }

  /** Get form data by id from api */
  getFormData(callback: (data: UserGroupModel[]) => void) {
    this.apiService.get<UserGroupModel[]>(this.apiPath, { id: this.id, multi: true, includeUsers: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: UserGroupModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: ['', Validators.required],
      Name: ['', Validators.required],
      Parent: [''],
      Users: [''],
      Description: [''],
    });
    if (data) {
      data[this.idKey + '_old'] = data.Code;
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: UserGroupModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/user/group/list']);
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
  executeGet(params: any, success: (resources: UserGroupModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeUsers'] = true;
    return super.executeGet(params, success, error);
  }
}
