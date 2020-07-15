import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ResourceModel } from '../../../../models/resource.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PermissionModel } from '../../../../models/permission.model';

@Component({
  selector: 'ngx-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss'],
})
export class ResourceFormComponent extends DataManagerFormComponent<ResourceModel> implements OnInit {

  componentName = 'ResourceFormComponent';
  idKey = 'Name';
  apiPath = '/module/resources';
  baseFormUrl = 'modules/resources/form';

  templatePermissionList: PermissionModel[] = [
    {
      Code: 'VIEW',
      Description: 'Xem',
    },
    {
      Code: 'CREATE',
      Description: 'Tạo',
    },
    {
      Code: 'UPDATE',
      Description: 'Cập nhật',
    },
    {
      Code: 'DELETE',
      Description: 'Xoá',
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
      Code: 'LIST',
      Description: 'Xem danh sách',
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
    // this.idKey = 'Name';
    // this.apiPath = '/module/modules';

    // Prepare blank form
    // this.form = this.formBuilder.group({
    //   array: this.formBuilder.array([
    //     this.makeNewFormGroup(),
    //   ]),
    // });
  }

  parentList: ResourceModel[];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  // getFormData(callback: (data: ResourceModel[]) => void) {
  //   this.apiService.get<ResourceModel[]>(this.apiPath, { id: this.id, multi: true, includeComponents: true, includeResources: true },
  //     data => callback(data),
  //   );
  // }

  /** Execute api get */
  executeGet(params: any, success: (resources: ResourceModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includePermissions'] = true;
    this.apiService.get<ResourceModel[]>(this.apiPath, params, data => success(data), e => {
      if (error) error(e); else this.onError(e);
      // this.onError(e);
    });
  }

  formLoad(formData: ResourceModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ResourceModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Components form load
      if (itemFormData.Permissions) itemFormData.Permissions.forEach(component => {
        const componentFormGroup = this.makeNewPermissionFormGroup(component);
        (newForm.get('Permissions') as FormArray).push(componentFormGroup);
        this.onAddPermissionFormGroup(componentFormGroup);
      });

      // // Resources form load
      // if (itemFormData.Resources) itemFormData.Resources.forEach(resource => {
      //   const resourceFormGroup = this.makeNewResourceFormGroup(resource);
      //   (newForm.get('Resources') as FormArray).push(resourceFormGroup);

      // });

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: ResourceModel): void {
    super.onAddFormGroup(index, newForm, formData);

    // Generate permissions
    if (!formData) {
      this.generatePermissions(index);
    }
  }

  generatePermissions(mainFormIndex: number) {
    this.templatePermissionList.forEach(pms => {
      if (pms.Code) {
        const permission = this.makeNewPermissionFormGroup({
          Code: pms.Code,
          Description: pms.Description,
        });
        const permissionList = this.getPermissions(mainFormIndex);
        permissionList.push(permission);
        this.onAddPermissionFormGroup(permission);
      }
    });
  }

  onGeneratePermissionsBtnClick(mainFormIndex: number) {
    this.generatePermissions(mainFormIndex);
    return false;
  }

  onRemoveFormGroup(index: number): void {

  }

  makeNewFormGroup(data?: ResourceModel): FormGroup {
    const newForm = this.formBuilder.group({
      Name_old: [''],
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Permissions: this.formBuilder.array([

      ]),
      Resources: this.formBuilder.array([

      ]),
    });

    if (data) {
      data[this.idKey + '_old'] = data[this.idKey];
      newForm.patchValue(data);
    }

    return newForm;
  }

  makeNewPermissionFormGroup(data?: PermissionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Code: ['', Validators.required],
      Description: [''],
      Status: [true],
    });

    if (data) {
      // data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    return newForm;
  }

  // makeNewResourceFormGroup(data?: ResourceModel): FormGroup {
  //   const newForm = this.formBuilder.group({
  //     Name_old: [''],
  //     Name: ['', Validators.required],
  //     Description: [''],
  //   });

  //   if (data) {
  //     // data['Name_old'] = data.Name;
  //     newForm.patchValue(data);
  //   }
  //   return newForm;
  // }

  getPermissions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Permissions') as FormArray;
  }

  // getResources(formGroupIndex: number) {
  //   return this.array.controls[formGroupIndex].get('Resources') as FormArray;
  // }

  // copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
  //   const currentFormControl = array.controls[i].get(formControlName);
  //   array.controls.forEach((formItem, index) => {
  //     if (index !== i) {
  //       formItem.get(formControlName).patchValue(currentFormControl.value);
  //     }
  //   });
  // }

  addPermissionFormGroup(formGroupIndex: number) {
    const permission = this.makeNewPermissionFormGroup();
    this.getPermissions(formGroupIndex).push(permission);
    this.onAddPermissionFormGroup(permission);
    // const path = component.get('Path');
    // const name = component.get('Name');
    // const description = component.get('Description');
    // path.valueChanges.subscribe(value => {
    //   if (!this.isProcessing && this.id.length === 0) {
    //     name.setValue(value);
    //     description.setValue(value);
    //   }
    // });
    return false;
  }

  onAddPermissionFormGroup(permission: FormGroup) {
    // const path = permission.get('Path');
    // const name = permission.get('Name');
    // const description = permission.get('Description');
    // path.valueChanges.subscribe(value => {
    //   if (!this.isProcessing) {
    //     name.setValue(value);
    //     description.setValue(value);
    //   }
    // });
  }

  removePermissionGroup(formGroupIndex: number, index: number) {
    this.getPermissions(formGroupIndex).removeAt(index);
    return false;
  }

  // addResourceFormGroup(formGroupIndex: number) {
  //   this.getResources(formGroupIndex).push(this.makeNewPermissionFormGroup());
  //   return false;
  // }

  // removeResourceGroup(formGroupIndex: number, index: number) {
  //   this.getResources(formGroupIndex).removeAt(index);
  //   return false;
  // }

  goback(): false {
    this.router.navigate(['modules/resources/list']);
    return false;
  }

  onAfterCreateSubmit(newFormData: ResourceModel[]): void {
    // this.goback();
    this.formLoad(newFormData);
    super.onAfterCreateSubmit(newFormData);
  }
  onAfterUpdateSubmit(newFormData: ResourceModel[]): void {
    // this.goback();
    this.formLoad(newFormData);
    super.onAfterUpdateSubmit(newFormData);
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void {

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
}
