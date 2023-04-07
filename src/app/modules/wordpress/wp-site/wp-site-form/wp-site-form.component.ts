import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { WpSiteModel } from '../../../../models/wordpress.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-wp-site-form',
  templateUrl: './wp-site-form.component.html',
  styleUrls: ['./wp-site-form.component.scss'],
})
export class WpSiteFormComponent extends DataManagerFormComponent<WpSiteModel> implements OnInit {

  componentName: string = 'WpSiteFormComponent';
  idKey = 'Code';
  apiPath = '/wordpress/wp-sites';
  baseFormUrl = '/wordpress/wp-site/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<WpSiteFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2ParamsOption = {
    placeholder: 'Brandname...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WpSiteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WpSiteModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Domain: [''],
      BaseUrl: [''],
      ApiUrl: [''],
      ApiUsername: [''],
      ApiPassword: [''],
      ApiToken: [''],
      WooConsumerKey: [''],
      WooConsumerSecret: [''],
      Supplier: [''],
      ServiceName: [''],
      Hosting: [''],
      CpAccessLink1: [''],
      CpAccessLink2: [''],
      CpUsername: [''],
      CpPassword: [''],
      Cp2fa: [''],
      CpNote: [''],
      RegisterDatetime: [''],
      Exprired: [''],
      ManagerEmail: [''],
      ManagerPhone: [''],
      SupportAdminObject: [''],
      SupportHotline: [''],
      SupportEmail: [''],
      ServiceIdentifed: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WpSiteModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/wordpress/wp-site/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
