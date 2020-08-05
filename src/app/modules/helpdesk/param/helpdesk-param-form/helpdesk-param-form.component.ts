import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelpdeskParamModel, HelpdeskParamOptionModel } from '../../../../models/helpdesk.model';

@Component({
  selector: 'ngx-helpdesk-param-form',
  templateUrl: './helpdesk-param-form.component.html',
  styleUrls: ['./helpdesk-param-form.component.scss'],
})
export class HelpdeskParamFormComponent extends DataManagerFormComponent<HelpdeskParamModel> implements OnInit {

  componentName: string = 'HelpdeskParamFormComponent';
  idKey = 'Name';
  apiPath = '/helpdesk/params';
  baseFormUrl = '/helpdesk/param/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<HelpdeskParamFormComponent>,
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
  executeGet(params: any, success: (resources: HelpdeskParamModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeOptions'] = true;
    super.executeGet(params, success, error);
  }

  formLoad(formData: HelpdeskParamModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: HelpdeskParamModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Options form load
      if (itemFormData.Options) {
        itemFormData.Options.forEach(condition => {
          const newOptionFormGroup = this.makeNewOptionFormGroup(condition);
          this.getOptions(index).push(newOptionFormGroup);
          const comIndex = this.getOptions(index).length - 1;
          this.onAddOptionFormGroup(index, comIndex, newOptionFormGroup);
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: HelpdeskParamModel): FormGroup {
    const newForm = this.formBuilder.group({
      Name_old: [''],
      Name: ['', Validators.required],
      DefaultOperator: ['', Validators.required],
      DefaultDataType: ['', Validators.required],
      RemoteDataSource: [''],
      Description: ['', Validators.required],
      Options: this.formBuilder.array([]),
    });
    if (data) {
      if (data['Name']) data['Name_old'] = data['Name'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: HelpdeskParamModel): void {
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

  /** Option Form */
  makeNewOptionFormGroup(data?: HelpdeskParamOptionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Data: ['', Validators.required],
      Label: ['', Validators.required],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getOptions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Options') as FormArray;
  }
  addOptionFormGroup(formGroupIndex: number) {
    // this.componentList[formGroupIndex].push([]);
    const newFormGroup = this.makeNewOptionFormGroup();
    this.getOptions(formGroupIndex).push(newFormGroup);
    this.onAddOptionFormGroup(formGroupIndex, this.getOptions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeOptionGroup(formGroupIndex: number, index: number) {
    this.getOptions(formGroupIndex).removeAt(index);
    // this.componentList[formGroupIndex].splice(index, 1);
    this.onRemoveOptionFormGroup(formGroupIndex, index);
    return false;
  }
  onAddOptionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.componentList[mainIndex].push([]);
  }
  onRemoveOptionFormGroup(mainIndex: number, index: number) {
    // this.componentList[mainIndex].splice(index, 1);
  }
  /** End Option Form */

}
