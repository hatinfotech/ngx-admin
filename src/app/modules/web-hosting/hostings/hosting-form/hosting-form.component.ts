import { Component, OnInit } from '@angular/core';
import { WebHostingService } from '../../web-hosting-service';
import { WebHostingBaseFormComponent } from '../../web-hosting-base-form.component';
import { WhHostingModel } from '../../../../models/wh-hosting.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-hosting-form',
  templateUrl: './hosting-form.component.html',
  styleUrls: ['./hosting-form.component.scss'],
})
export class HostingFormComponent extends WebHostingBaseFormComponent<WhHostingModel> implements OnInit {

  componentName: string = 'HostingFormComponent';
  idKey = 'Code';
  apiPath = '/web-hosting/hostings';
  baseFormUrl = '/web-hosting/hostings/form';

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public webHostingService: WebHostingService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, webHostingService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WhHostingModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WhHostingModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Host: ['', Validators.required],
      HostIp: ['', Validators.required],
      ApiLocation: ['', Validators.required],
      ApiUrl: ['', Validators.required],
      Username: ['', Validators.required],
      Password: ['', Validators.required],
      ClientId: ['', Validators.required],
      ClientName: ['', Validators.required],
      ApiKey: [''],
      ApiVersion: [''],
      Enabled: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WhHostingModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/web-hosting/hostings/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAfterCreateSubmit(newFormData: WhHostingModel[]) {
    super.onAfterCreateSubmit(newFormData);
    this.webHostingService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: WhHostingModel[]) {
    super.onAfterUpdateSubmit(newFormData);
    this.webHostingService.reloadCache();
  }
}
