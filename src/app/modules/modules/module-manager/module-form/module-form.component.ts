import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { ComponentModel } from '../../../../models/component.model';
import { ModuleModel } from '../../../../models/module.model';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { ResourceModel } from '../../../../models/resource.model';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';

@Component({
  selector: 'ngx-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.scss'],
})
export class ModuleFormComponent extends DataManagerFormComponent<ModuleModel> implements OnInit {

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService);
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
    super.ngOnInit();
  }

  getFormData(callback: (data: ModuleModel[]) => void) {
    this.apiService.get<ModuleModel[]>(this.apiPath, { id: this.id, multi: true, includeComponents: true, includeResources: true },
      data => callback(data),
    );
  }

  formLoad(formData: ModuleModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ModuleModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Components form load
      itemFormData.Components.forEach(component => {
        (newForm.get('Components') as FormArray).push(this.makeNewComponentFormGroup(component));
      });

      // Resources form load
      itemFormData.Resources.forEach(resource => {
        (newForm.get('Resources') as FormArray).push(this.makeNewResourceFormGroup(resource));
      });

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: ModuleModel): void {

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

  copyFormControlValueToOthers(i: number, formControlName: string) {
    const currentFormControl = this.array.controls[i].get(formControlName);
    this.array.controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentFormControl.value);
      }
    });
  }

  addComponentFormGroup(formGroupIndex: number) {
    this.getComponents(formGroupIndex).push(this.makeNewComponentFormGroup());
    return false;
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

  goback() {
    this.router.navigate(['modules/manager/list']);
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

}
