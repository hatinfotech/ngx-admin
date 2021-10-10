import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { ComponentModel } from '../../../../models/component.model';
import { ModuleModel } from '../../../../models/module.model';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { ResourceModel } from '../../../../models/resource.model';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.scss'],
})
export class ModuleFormComponent extends DataManagerFormComponent<ModuleModel> implements OnInit {

  componentName = 'ModuleFormComponent';
  idKey = 'Name';
  apiPath = '/module/modules';
  baseFormUrl = 'modules/manager/form';

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
    this.idKey = 'Name';
    this.apiPath = '/module/modules';

    // Prepare blank form
    // this.form = this.formBuilder.group({
    //   array: this.formBuilder.array([
    //     this.makeNewFormGroup(),
    //   ]),
    // });
  }

  parentList: ModuleModel[];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ModuleModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeCode'] = true;
    super.executeGet(params, success, error);
  }


  getFormData(callback: (data: ModuleModel[]) => void) {
    this.apiService.get<ModuleModel[]>(this.apiPath, { id: this.id, multi: true, includeComponents: true, includeResources: true },
      data => callback(data),
    );
  }

  async formLoad(formData: ModuleModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ModuleModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Components form load
      if (itemFormData.Components) itemFormData.Components.forEach(component => {
        const componentFormGroup = this.makeNewComponentFormGroup(component);
        (newForm.get('Components') as FormArray).push(componentFormGroup);
        this.onAddComponentFormGroup(componentFormGroup);
      });

      // Resources form load
      if (itemFormData.Resources) itemFormData.Resources.forEach(resource => {
        const resourceFormGroup = this.makeNewResourceFormGroup(resource);
        (newForm.get('Resources') as FormArray).push(resourceFormGroup);

      });

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: ModuleModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }

  onRemoveFormGroup(index: number): void {

  }

  makeNewFormGroup(data?: ModuleModel): FormGroup {
    const newForm = this.formBuilder.group({
      Name_old: [''],
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Components: this.formBuilder.array([

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

  makeNewComponentFormGroup(data?: ComponentModel): FormGroup {
    const newForm = this.formBuilder.group({
      Name_old: [''],
      Name: ['', Validators.required],
      Description: [''],
      Path: [''],
    });

    if (data) {
      data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewResourceFormGroup(data?: ResourceModel): FormGroup {
    const newForm = this.formBuilder.group({
      Name_old: [''],
      Name: ['', Validators.required],
      Description: [''],
    });

    if (data) {
      data['Name_old'] = data.Name;
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

  copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
    const currentFormControl = array.controls[i].get(formControlName);
    array.controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentFormControl.value);
      }
    });
  }

  addComponentFormGroup(formGroupIndex: number) {
    const component = this.makeNewComponentFormGroup();
    this.getComponents(formGroupIndex).push(component);
    this.onAddComponentFormGroup(component);
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

  onAddComponentFormGroup(component: FormGroup) {
    // const path = component.get('Path');
    // const name = component.get('Name');
    // const description = component.get('Description');
    // path.valueChanges.subscribe(value => {
    //   if (!this.isProcessing) {
    //     name.setValue(value);
    //     description.setValue(value);
    //   }
    // });
  }

  removeComponentGroup(formGroupIndex: number, index: number) {
    this.getComponents(formGroupIndex).removeAt(index);
    return false;
  }

  addResourceFormGroup(formGroupIndex: number) {
    this.getResources(formGroupIndex).push(this.makeNewComponentFormGroup());
    return false;
  }

  removeResourceGroup(formGroupIndex: number, index: number) {
    this.getResources(formGroupIndex).removeAt(index);
    return false;
  }

  goback(): false {
    this.router.navigate(['modules/manager/list']);
    return false;
  }

  onAfterCreateSubmit(newFormData: ModuleModel[]): void {
    // this.goback();
    this.formLoad(newFormData);
    super.onAfterCreateSubmit(newFormData);
  }
  onAfterUpdateSubmit(newFormData: ModuleModel[]): void {
    // this.goback();
    this.formLoad(newFormData);
    super.onAfterUpdateSubmit(newFormData);
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }

}
