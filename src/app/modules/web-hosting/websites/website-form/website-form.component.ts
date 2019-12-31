import { Component, OnInit } from '@angular/core';
import { WebHostingBaseFormComponent } from '../../web-hosting-base-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { WebHostingService } from '../../web-hosting-service';
import { HttpErrorResponse } from '@angular/common/http';
import { WhWebsiteModel } from '../../../../models/wh-website.model';

@Component({
  selector: 'ngx-website-form',
  templateUrl: './website-form.component.html',
  styleUrls: ['./website-form.component.scss'],
})
export class WebsiteFormComponent extends WebHostingBaseFormComponent<WhWebsiteModel> implements OnInit {

  componentName: string = 'WebsiteFormComponent';
  idKey = 'domain_id';
  apiPath = '/web-hosting/websites';
  baseFormUrl = '/web-hosting/websites/form';

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public webHostingService: WebHostingService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, webHostingService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WhWebsiteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WhWebsiteModel): FormGroup {
    const newForm = this.formBuilder.group({
      domain_id: [''],
      hosting: [''],
      domain: ['', Validators.required],
      ip_address: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WhWebsiteModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/web-hosting/websites/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
