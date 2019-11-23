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

@Component({
  selector: 'ngx-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
})
export class MenuFormComponent extends DataManagerFormComponent<MenuItemModel> implements OnInit {

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected commonService: CommonService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastService, dialogService, commonService);
    this.apiPath = '/menu/menu-items';
    this.idKey = 'Code';
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
      Code: 'VIEW',
      Description: 'Xem dữ liệu',
    },
    {
      Code: 'CREATE',
      Description: 'Tạo dữ liệu',
    },
    {
      Code: 'UPDATE',
      Description: 'Cập nhật dữ liệu',
    },
    {
      Code: 'DELETE',
      Description: 'Xoá dữ liệu',
    },
    {
      Code: 'PRINT',
      Description: 'In dữ liệu',
    },
    {
      Code: 'SAHRE',
      Description: 'Chia sẻ dữ liệu',
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

  ngOnInit() {

    this.apiService.get<MenuItemModel[]>(
      '/menu/menu-items', { limit: 99999 },
      list => {
        list.unshift({
          Code: '',
          Title: 'Chọn Menu cha...',
        });
        this.parentList = list.map(item => {
          item['id'] = item['Code'];
          item['text'] = item['Title'];
          return item;
        });

        this.apiService.get<ModuleModel[]>(
          '/module/modules', { limit: 99999, includeComponents: true },
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
    this.apiService.get<MenuItemModel[]>(this.apiPath, { id: this.id, multi: true, includeComponents: true, includePermissions: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  formLoad(formData: MenuItemModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: MenuItemModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Components form load
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

      // Permissions form load
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
      Components: this.formBuilder.array([

      ]),
      Permissions: this.formBuilder.array([

      ]),
    });

    if (data) {
      data[this.idKey + '_old'] = data.Code;
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewComponentFormGroup(data?: { Id: number, Module: string, Component: string }): FormGroup {
    const newForm = this.formBuilder.group({
      Id_old: [''],
      Id: [''],
      Module: ['', Validators.required],
      Component: ['', Validators.required],
    });

    if (data) {
      data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewPermissionFormGroup(data?: PermissionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id_old: [''],
      Id: [''],
      Code: ['', Validators.required],
      Description: ['', Validators.required],
      Status: [''],
    });

    if (data) {
      data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }

  getComponents(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Components') as FormArray;
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

  addPermissionFormGroup(formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewPermissionFormGroup();
    this.getPermissions(formGroupIndex).push(newFormGroup);
    this.onAddPermissionFormGroup(formGroupIndex, this.getPermissions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }

  onAddFormGroup(index: number, newForm: FormGroup, data?: MenuItemModel) {
    this.componentList.push([]);
  }

  onRemoveFormGroup(index: number) {
    this.componentList.splice(index, 1);
  }

  onAddComponentFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    this.componentList[mainIndex].push([]);
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

  removePermissionGroup(formGroupIndex: number, index: number) {
    this.getPermissions(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemovePermissionFormGroup(formGroupIndex, index);
    return false;
  }

  onRemoveComponentFormGroup(mainIndex: number, index: number) {
    this.componentList[mainIndex].splice(index, 1);
  }

  onRemovePermissionFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }

  copyMainFormControlValueToOthers(i: number, formControlName: string) {
    const currentFormControl = this.array.controls[i].get(formControlName);
    this.array.controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentFormControl.value);
      }
    });
  }

  copyComponentFormControlValueToOthers(i: number, ic: number, formControlName: string) {
    const currentFormControl = this.getComponents(i).controls[ic].get(formControlName);
    this.getComponents(i).controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentFormControl.value);
      }
    });
  }


  goback() {
    this.router.navigate(['menu/manager/list']);
  }

  onModuleChange(event: { Components }, i: number, ic: number) {
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

  onPermimssionChange(mainFormIndex: number, ip: number, item: PermissionModel) {
    // console.info(item);

    if (!this.formLoading) {
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
}
