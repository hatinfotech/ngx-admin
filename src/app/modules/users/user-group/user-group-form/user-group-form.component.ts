import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { UserModel } from '../../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

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
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/user/users', { select: 'Code=>Code,Name=>Name,id=>Code,text=>Code', filter_Name: params['term'] ? params['term'] : '' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
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

  roles: { id: string, text: string }[] = [
    {
      id: 'MANAGER',
      text: 'Manager',
    },
    {
      id: 'MEMBER',
      text: 'Member',
    },
  ];
  select2OptionForRoles = {
    placeholder: 'Chọn nhóm vai trò...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };


  // resourceList: ResourceModel[][][] = [];
  // select2OptionForResource = {
  //   placeholder: 'Chọn Resource...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'Name',
  //     text: 'Description',
  //   },
  // };

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
          item['text'] = item['Name'] + ': ' + item['Description'];
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

  async formLoad(formData: UserGroupModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: UserGroupModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Resources form load
      if (itemFormData.Users) {
        itemFormData.Users.forEach(user => {
          const newResourceFormGroup = this.makeNewUserFormGroup(user);
          this.getUsers(index).push(newResourceFormGroup);
          const comIndex = this.getUsers(index).length - 1;
          this.onAddUserFormGroup(index, comIndex, newResourceFormGroup);

          // module['Users'].map(item => {
          //   item['id'] = item['Name'];
          //   item['text'] = item['Description'] ? item['Description'] : item['Name'];
          //   return item;
          // });

          // const module = this.moduleList.find((value, i, obj) => {
          //   return resource['Module'] === value['Name'];
          // });
          // if (module && module['Resources']) {
          //   this.resourceList[index][comIndex] = module['Resources'].map(item => {
          //     item['id'] = item['Name'];
          //     item['text'] = item['Description'] ? item['Description'] : item['Name'];
          //     return item;
          //   });

          //   const resourceChooseList = module['Resources'].find((value, i, obj) => {
          //     return value.Name === resource['Resource'];
          //   });
          //   newResourceFormGroup.get('Resource').patchValue(resource['Resource']);


          // }

        });
      }


      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  async init() {
    return super.init();
  }

  /** Get form data by id from api */
  getFormData(callback: (data: UserGroupModel[]) => void) {
    this.apiService.get<UserGroupModel[]>(this.apiPath, { id: this.id, multi: true, includeUsersInGroup: true },
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
      // Users: [''],
      Description: [''],
      Users: this.formBuilder.array([]),
    });
    if (data) {
      data[this.idKey + '_old'] = data.Code;
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: UserGroupModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // this.resourceList.push([]);
  }
  onRemoveFormGroup(index: number): void {
    // this.resourceList.splice(index, 1);
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
    params['includeUsersInGroup'] = true;
    return super.executeGet(params, success, error);
  }

  makeNewUserFormGroup(data?: UserModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Id_old: [''],
      Id: [''],
      User: ['', Validators.required],
      Roles: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }

  getUsers(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Users') as FormArray;
  }

  addUserFormGroup(formGroupIndex: number) {
    // this.resourceList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewUserFormGroup();
    this.getUsers(formGroupIndex).push(newFormGroup);
    this.onAddUserFormGroup(formGroupIndex, this.getUsers(formGroupIndex).length - 1, newFormGroup);
    return false;
  }

  onAddUserFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.resourceList[mainIndex].push([]);
  }

  removeUser(formGroupIndex: number, index: number) {
    this.getUsers(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveUserFormGroup(formGroupIndex, index);
    return false;
  }

  onRemoveUserFormGroup(mainIndex: number, index: number) {
    // this.resourceList[mainIndex].splice(index, 1);
  }



  copyResourceFormControlValueToOthers(i: number, ic: number, formControlName: string) {
    const currentFormControl = this.getUsers(i).controls[ic].get(formControlName);
    this.getUsers(i).controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentFormControl.value);
      }
    });
  }

  onModuleChangeForResource(event: { Resources: any[] }, i: number, ir: number) {
    // console.info(event);
    if (event.Resources) {
      event.Resources.unshift({
        Name: '',
        Description: 'Chọn resource',
      });
      // this.resourceList[i][ir] = event.Resources.map(item => {
      //   item['id'] = item['Name'];
      //   item['text'] = item['Description'] ? item['Description'] : item['Name'];
      //   return item;
      // });
    }
  }

  getResourceChooseList(mainFormIndex: number, resourceIndex: number) {
    // if (this.resourceList && this.resourceList[mainFormIndex] && this.resourceList[mainFormIndex][resourceIndex]) {
    //   return this.resourceList[mainFormIndex][resourceIndex];
    // }
    return [];
  }









}
