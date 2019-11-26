import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { UserModel } from '../../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-user-group-form',
  templateUrl: './user-group-form.component.html',
  styleUrls: ['./user-group-form.component.scss'],
})
export class UserGroupFormComponent extends DataManagerFormComponent<UserGroupModel> implements OnInit {

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
    this.apiPath = '/user/groups';
    this.idKey = 'Code';
  }

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

  ngOnInit() {
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
      Users: [''],
      Description: [''],
    });
    if (data) {
      data[this.idKey + '_old'] = data.Code;
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: UserGroupModel): void { }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['users/group/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
