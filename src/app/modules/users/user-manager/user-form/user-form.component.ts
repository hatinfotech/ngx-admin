import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { UserModel } from '../../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { UserGroupModel } from '../../../../models/user-group.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent extends DataManagerFormComponent<UserModel> implements OnInit {

  componentName: string = 'UserFormComponent';
  idKey = 'Code';
  apiPath = '/user/users';
  baseFormUrl = '/users/user-manager/form';

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
    this.apiService.get<UserGroupModel[]>('/user/groups', { limit: 9999999 },
      list => {
        this.groupList = list.map((item: UserGroupModel) => {
          return {
            ...item,
            Group: item.Code,
            id: item.Code,
            text: item.Name,
          };
        });
        super.ngOnInit();
      });

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
      Code_old: [''],
      Code: [''],
      Username: ['', Validators.required],
      Name: ['', Validators.required],
      Phone: [''],
      Email: [''],
      Groups: [''],
    });
    if (data) {
      data[this.idKey + '_old'] = data.Code;
      // data['Groups'] = data['Groups'].map(item => {
      //   return item.Code;
      // });
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: UserModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void { }
  goback(): false {
    this.router.navigate(['/users/user-manager/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
