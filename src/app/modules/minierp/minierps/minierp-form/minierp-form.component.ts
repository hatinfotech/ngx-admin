import { Component, OnInit } from '@angular/core';
import { MinierpBaseFormComponent } from '../../minierp-base-form.component';
import { MiniErpModel } from '../../../../models/minierp.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MinierpService } from '../../minierp-service.service';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-minierp-form',
  templateUrl: './minierp-form.component.html',
  styleUrls: ['./minierp-form.component.scss'],
})
export class MinierpFormComponent extends MinierpBaseFormComponent<MiniErpModel> implements OnInit {

  componentName: string = 'MinierpFormComponent';
  idKey = 'Code';
  apiPath = '/mini-erp/minierps';
  baseFormUrl = '/minierp/minierps/form';

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public minierpService: MinierpService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, minierpService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: MiniErpModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: MiniErpModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      ApiUrl: ['', Validators.required],
      ApiVersion: [''],
      Version: [''],
      License: [''],
      ApiUser: [''],
      ApiPassword: ['******'],
      Enabled: [''],
      AutoUpdate: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: MiniErpModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/minierp/minierps/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAfterCreateSubmit(newFormData: MiniErpModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: MiniErpModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
}
