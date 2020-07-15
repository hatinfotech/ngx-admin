import { Component, OnInit } from '@angular/core';
import { MenuItemModel } from '../../../../models/menu-item.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ModuleModel } from '../../../../models/module.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentModel } from '../../../../models/component.model';
import { PermissionModel } from '../../../../models/permission.model';
import { CommonService } from '../../../../services/common.service';
import { ResourceModel } from '../../../../models/resource.model';

@Component({
  selector: 'ngx-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
})
export class MenuFormComponent extends DataManagerFormComponent<MenuItemModel> implements OnInit {

  componentName = 'MenuFormComponent';
  idKey = 'Code';
  apiPath = '/menu/menu-items';
  baseFormUrl = 'menu/manager/form';

  permissionList: PermissionModel[][][] = [];
  permissionListConfig = {
    placeholder: 'Chọn permission...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Description',
    },
  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public commonService: CommonService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastService, dialogService, commonService);
  }

  parentList: MenuItemModel[];
  select2OptionForParent = {
    placeholder: 'Chọn Menu cha...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
  };

  templatePermissionList: PermissionModel[] = [
    {
      Code: 'MENU',
      Description: 'Hiển thị menu',
    },
    {
      Code: 'DASHBOARD',
      Description: 'Dashboard',
    },
    {
      Code: 'LIST',
      Description: 'Danh sách',
    },
    {
      Code: 'DELETE',
      Description: 'Xoá',
    },
    {
      Code: 'FORM',
      Description: 'Biểu mẫu',
    },
    {
      Code: 'PRINT',
      Description: 'In',
    },
    {
      Code: 'SAHRE',
      Description: 'Chia sẻ',
    },
    {
      Code: 'REPORT',
      Description: 'Báo cáo',
    },
    {
      Code: 'ACCESS',
      Description: 'Truy cập',
    },
  ].map((item) => {
    item['id'] = item['Code'];
    item['text'] = item['Description'];
    return item;
  });
  select2OptionForPermissionCode = {
    placeholder: 'Chọn hoặc tạo mới...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'Code',
      text: 'Description',
    },
  };

  moduleList: ModuleModel[];
  select2OptionForModule = {
    placeholder: 'Chọn Module...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },
  };

  componentList: ComponentModel[][][] = [];
  select2OptionForComponent = {
    placeholder: 'Chọn Component...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },
    // matcher: (term: string, text: string, option: any) => {
    //   return false;
    // },
  };

  resourceList: ResourceModel[][][] = [];
  select2OptionForResource = {
    placeholder: 'Chọn Resource...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },
  };

  ngOnInit() {
    this.restrict();
    this.apiService.get<MenuItemModel[]>(
      '/menu/menu-items', { limit: 99999, list: true },
      list => {
        list.unshift({
          Code: '',
          Title: 'Chọn Menu cha...',
        });
        this.parentList = list.filter(item => {
          if (item['Code'] && item['Title']) {
            item['id'] = item['Code'];
            item['text'] = item['Title'];

            return item;
          }
          return false;
        });

        this.apiService.get<ModuleModel[]>(
          '/module/modules', { limit: 99999, list: true, includeComponents: true, includeResources: true, includeResourcePermissions: true },
          mList => {
            mList.unshift({
              Name: '',
              Description: 'Chọn Module...',
            });
            this.moduleList = mList.map(item => {
              item['id'] = item['Name'];
              item['text'] = item['Description'] ? item['Description'] : item['Name'];
              return item;
            });
            super.ngOnInit();
          });
      });

  }

  /** Get form data by id from api */
  getFormData(callback: (data: MenuItemModel[]) => void) {
    this.apiService.get<MenuItemModel[]>(this.apiPath, { id: this.id, multi: true, includeComponents: true, includePermissions: true, includeResources: true, includeResourcePermissions: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  formLoad(formData: MenuItemModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: MenuItemModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Components form load
      if (itemFormData.Components) {
        itemFormData.Components.forEach(component => {
          const newComponentFormGroup = this.makeNewComponentFormGroup(component);
          // (newForm.get('Components') as FormArray).push(newComponentFormGroup);
          this.getComponents(index).push(newComponentFormGroup);
          const comIndex = this.getComponents(index).length - 1;
          this.onAddComponentFormGroup(index, comIndex, newComponentFormGroup);
          const module = this.moduleList.find((value, i, obj) => {
            return component['Module'] === value['Name'];
          });
          if (module && module['Components']) {
            this.componentList[index][comIndex] = module['Components'].map(item => {
              item['id'] = item['Name'];
              item['text'] = item['Description'] ? item['Description'] : item['Name'];
              return item;
            });
            newComponentFormGroup.get('Component').patchValue(component['Component']);
          }
        });
      }

      // Resources form load
      if (itemFormData.Resources) {
        itemFormData.Resources.forEach(resource => {
          const newResourceFormGroup = this.makeNewResourceFormGroup(resource);
          this.getResources(index).push(newResourceFormGroup);
          const comIndex = this.getResources(index).length - 1;
          this.onAddResourceFormGroup(index, comIndex, newResourceFormGroup);
          const module = this.moduleList.find((value, i, obj) => {
            return resource['Module'] === value['Name'];
          });
          if (module && module['Resources']) {
            this.resourceList[index][comIndex] = module['Resources'].map(item => {
              item['id'] = item['Name'];
              item['text'] = item['Description'] ? item['Description'] : item['Name'];
              return item;
            });

            const resourceChooseList = module['Resources'].find((value, i, obj) => {
              return value.Name === resource['Resource'];
            });
            this.permissionList[index][comIndex] = resourceChooseList.Permissions.map(item => {
              item['id'] = item['Code'];
              item['text'] = item['Description'];
              return item;
              // return {
              //   id: item['Name'],
              //   text: item['Description'],
              // };
            });
            newResourceFormGroup.get('Resource').patchValue(resource['Resource']);


          }

          // if (module && module['Resources']) {
          //   this.resourceList[index][comIndex] = module['Resources'].map(item => {
          //     item['id'] = item['Name'];
          //     item['text'] = item['Description'] ? item['Description'] : item['Name'];
          //     return item;
          //   });
          //   newResourceFormGroup.get('Resource').patchValue(resource['Resource']);
          // }
        });
      }

      // Permissions form load
      if (itemFormData.Permissions) {
        itemFormData.Permissions.forEach(permission => {
          const newPermissionFormGroup = this.makeNewPermissionFormGroup(permission);
          // (newForm.get('Components') as FormArray).push(newComponentFormGroup);
          this.getPermissions(index).push(newPermissionFormGroup);
          const comIndex = this.getComponents(index).length - 1;
          this.onAddPermissionFormGroup(index, comIndex, newPermissionFormGroup);
          // const module = this.moduleList.find((value, i, obj) => {
          //   return component['Module'] === value['Name'];
          // });
          // this.componentList[index][comIndex] = module['Components'].map(item => {
          //   item['id'] = item['Name'];
          //   item['text'] = item['Description'] ? item['Description'] : item['Name'];
          //   return item;
          // });
          if (this.templatePermissionList.findIndex((value: PermissionModel) => value.Code === permission['Code']) < 0) {
            permission['id'] = permission['Code'];
            permission['text'] = permission['Description'];
            this.templatePermissionList.push(permission);
          }
          newPermissionFormGroup.get('Code').patchValue(permission['Code']);
        });
      }

      // // Resources form load
      // itemFormData.Resources.forEach(resource => {
      //   (newForm.get('Resources') as FormArray).push(this.makeNewResourceFormGroup(resource));
      // });

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: MenuItemModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: ['', Validators.required],
      Title: ['', Validators.required],
      Link: [''],
      Icon: [''],
      Group: [''],
      Parent: [''],
      No: [''],
      Components: this.formBuilder.array([]),
      Permissions: this.formBuilder.array([]),
      Resources: this.formBuilder.array([]),
    });

    if (data) {
      data[this.idKey + '_old'] = data.Code;
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewComponentFormGroup(data?: { Id: number, Module: string, Component: string }): FormGroup {
    const newForm = this.formBuilder.group({
      // Id_old: [''],
      Id: [''],
      Module: ['', Validators.required],
      Component: ['', Validators.required],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewResourceFormGroup(data?: { Id: number, Module: string, Resource: string }): FormGroup {
    const newForm = this.formBuilder.group({
      // Id_old: [''],
      Id: [''],
      Module: ['', Validators.required],
      Resource: ['', Validators.required],
      Permissions: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewPermissionFormGroup(data?: PermissionModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Id_old: [''],
      Id: [''],
      Code: ['', Validators.required],
      Description: ['', Validators.required],
      Status: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }

  getComponents(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Components') as FormArray;
  }

  getResources(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Resources') as FormArray;
  }

  getPermissions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Permissions') as FormArray;
  }

  addComponentFormGroup(formGroupIndex: number) {
    this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewComponentFormGroup();
    this.getComponents(formGroupIndex).push(newFormGroup);
    this.onAddComponentFormGroup(formGroupIndex, this.getComponents(formGroupIndex).length - 1, newFormGroup);
    return false;
  }

  addResourceFormGroup(formGroupIndex: number) {
    this.resourceList[formGroupIndex].push([]);
    this.permissionList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewResourceFormGroup();
    this.getResources(formGroupIndex).push(newFormGroup);
    this.onAddResourceFormGroup(formGroupIndex, this.getResources(formGroupIndex).length - 1, newFormGroup);
    return false;
  }

  addPermissionFormGroup(formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewPermissionFormGroup();
    this.getPermissions(formGroupIndex).push(newFormGroup);
    this.onAddPermissionFormGroup(formGroupIndex, this.getPermissions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: MenuItemModel) {
    super.onAddFormGroup(index, newForm, formData);
    this.componentList.push([]);
    this.resourceList.push([]);
    this.permissionList.push([]);
  }

  onRemoveFormGroup(index: number) {
    this.componentList.splice(index, 1);
    this.resourceList.splice(index, 1);
    this.permissionList.splice(index, 1);
  }

  onAddComponentFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    this.componentList[mainIndex].push([]);
  }

  onAddResourceFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    this.resourceList[mainIndex].push([]);
    this.permissionList[mainIndex].push([]);
  }

  onAddPermissionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }

  removeComponentGroup(formGroupIndex: number, index: number) {
    this.getComponents(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveComponentFormGroup(formGroupIndex, index);
    return false;
  }

  removeResourceGroup(formGroupIndex: number, index: number) {
    this.getResources(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveResourceFormGroup(formGroupIndex, index);
    return false;
  }

  removePermissionGroup(formGroupIndex: number, index: number) {
    this.getPermissions(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemovePermissionFormGroup(formGroupIndex, index);
    return false;
  }

  onRemoveComponentFormGroup(mainIndex: number, index: number) {
    this.componentList[mainIndex].splice(index, 1);
  }

  onRemoveResourceFormGroup(mainIndex: number, index: number) {
    this.resourceList[mainIndex].splice(index, 1);
    this.permissionList[mainIndex].splice(index, 1);
  }

  onRemovePermissionFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }

  // copyMainFormControlValueToOthers(i: number, formControlName: string) {
  //   const currentFormControl = this.array.controls[i].get(formControlName);
  //   this.array.controls.forEach((formItem, index) => {
  //     if (index !== i) {
  //       formItem.get(formControlName).patchValue(currentFormControl.value);
  //     }
  //   });
  // }

  // copyComponentFormControlValueToOthers(i: number, ic: number, formControlName: string) {
  //   const currentFormControl = this.getComponents(i).controls[ic].get(formControlName);
  //   this.getComponents(i).controls.forEach((formItem, index) => {
  //     if (index !== i) {
  //       formItem.get(formControlName).patchValue(currentFormControl.value);
  //     }
  //   });
  // }



  copyResourceFormControlValueToOthers(i: number, ic: number, formControlName: string) {
    const currentFormControl = this.getResources(i).controls[ic].get(formControlName);
    this.getResources(i).controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentFormControl.value);
      }
    });
  }


  goback(): false {
    this.router.navigate(['menu/manager/list']);
    return false;
  }

  onModuleChange(event: { Components: any[] }, i: number, ic: number) {
    // console.info(event);
    if (event.Components) {
      event.Components.unshift({
        Name: '',
        Description: 'Chọn component',
      });
      this.componentList[i][ic] = event.Components.map(item => {
        item['id'] = item['Name'];
        item['text'] = item['Description'] ? item['Description'] : item['Name'];
        return item;
      });
    }
  }

  onModuleChangeForResource(event: { Resources: any[] }, i: number, ir: number) {
    // console.info(event);
    if (event.Resources) {
      event.Resources.unshift({
        Name: '',
        Description: 'Chọn resource',
      });
      this.resourceList[i][ir] = event.Resources.map(item => {
        item['id'] = item['Name'];
        item['text'] = item['Description'] ? item['Description'] : item['Name'];
        return item;
      });
    }
  }

  onResourceChangeForPermission(event: { Permissions: any[] }, i: number, ir: number) {
    // console.info(event);
    if (event.Permissions) {
      event.Permissions.unshift({
        Name: '',
        Description: 'Chọn permission',
      });
      this.permissionList[i][ir] = event.Permissions.map(item => {
        item['id'] = item['Code'];
        item['text'] = item['Description'];
        return item;
      });
    }
  }

  onPermimssionChange(mainFormIndex: number, ip: number, item: PermissionModel) {
    // console.info(item);

    if (!this.isProcessing) {
      if (item) {
        if (this.templatePermissionList.findIndex((value: PermissionModel) => value.Code === item['Code']) < 0) {
          this.templatePermissionList.push(item);
        }
        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (item['Code']) {
          this.getPermissions(mainFormIndex).controls[ip].get('Description').setValue(item['Description']);
          this.getPermissions(mainFormIndex).controls[ip].get('Status').setValue(1);
        }
      }
    }

  }

  onUpdatePastFormData(aPastFormData: { formData: any, meta: any }) {
    aPastFormData['meta'] = {
      componentList: this.componentList,
      templatePermissionList: this.templatePermissionList,
    };
  }

  onUndoPastFormData(aPastFormData: { formData: any, meta: any }) {
    this.componentList = aPastFormData['meta']['componentList'];
    this.templatePermissionList = aPastFormData['meta']['templatePermissionList'];
  }

  // onAfterCreateSubmit(newFormData: MenuItemModel[]) {
  //   super.onAfterCreateSubmit(newFormData);
  //   this.goback();
  // }

  // onAfterUpdateSubmit(newFormData: MenuItemModel[]) {
  //   super.onAfterUpdateSubmit(newFormData);
  //   this.goback();
  // }

  getResourceChooseList(mainFormIndex: number, resourceIndex: number) {
    if (this.resourceList && this.resourceList[mainFormIndex] && this.resourceList[mainFormIndex][resourceIndex]) {
      return this.resourceList[mainFormIndex][resourceIndex];
    }
    return [];
  }
  getPermissionChooseList(mainFormIndex: number, resourceIndex: number) {
    if (this.permissionList && this.permissionList[mainFormIndex] && this.permissionList[mainFormIndex][resourceIndex]) {
      return this.permissionList[mainFormIndex][resourceIndex];
    }
    return [];
  }
}
