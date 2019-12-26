import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { PbxModel } from '../../../../models/pbx.model';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { HttpErrorResponse } from '@angular/common/http';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { IvoipService } from '../../ivoip-service';

@Component({
  selector: 'ngx-pbx-form',
  templateUrl: './pbx-form.component.html',
  styleUrls: ['./pbx-form.component.scss'],
})
export class PbxFormComponent extends IvoipBaseFormComponent<PbxModel> implements OnInit {

  componentName = 'PbxFormComponent';
  idKey = 'Code';
  apiPath = '/ivoip/pbxs';
  baseFormUrl = '/ivoip/pbxs/form';

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    public commonService: CommonService,
    public ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  // /** Get form data by id from api */
  // getFormData(callback: (data: PbxModel[]) => void) {
  //   this.apiService.get<PbxModel[]>(this.apiPath, { id: this.id, includeDomains: true },
  //     data => callback(data),
  //   ), (e: HttpErrorResponse) => {
  //     this.onError(e);
  //   };
  // }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    params['includeDomains'] = true;
    this.apiService.get<PbxModel[]>(this.apiPath, params, data => success(data), e => {
      if (error) error(e); else this.onError(e);
    });
  }

  formLoad(formData: PbxModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PbxModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Domains form load
      if (itemFormData.Domains) {
        itemFormData.Domains.forEach(domain => {
          (newForm.get('Domains') as FormArray).push(this.makeNewDomainFormGroup(domain));
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  makeNewFormGroup(data?: PbxModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Description: [''],
      ApiUrl: ['', Validators.required],
      ApiVersion: [''],
      BaseDomainName: [''],
      ApiKey: [''],
      Domains: this.formBuilder.array([

      ]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewDomainFormGroup(data?: PbxDomainModel): FormGroup {
    const newForm = this.formBuilder.group({
      DomainId: [''],
      DomainName: [''],
      // AdminKey: ['', Validators.required],
      Description: [''],
    });

    if (data) {
      // data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    newForm.disable();
    return newForm;
  }

  getDomains(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Domains') as FormArray;
  }

  addDomainFormGroup(formGroupIndex: number) {
    this.getDomains(formGroupIndex).push(this.makeNewDomainFormGroup());
    return false;
  }

  removeDomainGroup(formGroupIndex: number, index: number) {
    this.getDomains(formGroupIndex).removeAt(index);
    return false;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/pbxs/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }

}
