import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { HelpdeskProcedureModel, HelpdeskProcedureStepModel } from '../../../../models/helpdesk.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import '../../../../lib/ckeditor.loader';
import 'ckeditor';
@Component({
  selector: 'ngx-helpdesk-procedure-form',
  templateUrl: './helpdesk-procedure-form.component.html',
  styleUrls: ['./helpdesk-procedure-form.component.scss'],
})
export class HelpdeskProcedureFormComponent extends DataManagerFormComponent<HelpdeskProcedureModel> implements OnInit {

  componentName: string = 'HelpdeskProcedureFormComponent';
  idKey = 'Code';
  apiPath = '/helpdesk/procedures';
  baseFormUrl = '/helpdesk/procedure/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<HelpdeskProcedureFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: HelpdeskProcedureModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeSteps'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: HelpdeskProcedureModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: HelpdeskProcedureModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Options form load
      if (itemFormData.Steps) {
        const children = this.getSteps(index);
        children.clear();
        itemFormData.Steps.forEach(step => {
          const newOptionFormGroup = this.makeNewStepFormGroup(step);
          children.push(newOptionFormGroup);
          const comIndex = children.length - 1;
          this.onAddStepFormGroup(index, comIndex, newOptionFormGroup);
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: HelpdeskProcedureModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Description: [''],
      State: [''],
      Steps: this.formBuilder.array([]),
    });
    if (data) {
      if (data['Name']) data['Name_old'] = data['Name'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: HelpdeskProcedureModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/promotion/promotion/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Step Form */
  makeNewStepFormGroup(data?: HelpdeskProcedureStepModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      // Title: [''],
      Description: ['', Validators.required],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  getSteps(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Steps') as FormArray;
  }
  addStepFormGroup(formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewStepFormGroup();
    this.getSteps(formGroupIndex).push(newFormGroup);
    this.onAddStepFormGroup(formGroupIndex, this.getSteps(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeStepGroup(formGroupIndex: number, index: number) {
    this.getSteps(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveStepFormGroup(formGroupIndex, index);
    return false;
  }
  onAddStepFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveStepFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  /** End Option Form */

}
