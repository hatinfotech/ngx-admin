import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { SmsGatewayModel } from '../../../../models/sms.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { SmsTemplateFormComponent } from '../../sms-template/sms-template-form/sms-template-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-sms-gateway-form',
  templateUrl: './sms-gateway-form.component.html',
  styleUrls: ['./sms-gateway-form.component.scss'],
})
export class SmsGatewayFormComponent extends DataManagerFormComponent<SmsGatewayModel> implements OnInit {

  componentName: string = 'SmsGatewayFormComponent';
  idKey = 'Code';
  apiPath = '/sms/gateway';
  baseFormUrl = '/sms/gateway/form';

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    protected ref: NbDialogRef<SmsTemplateFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
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
  executeGet(params: any, success: (resources: SmsGatewayModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: SmsGatewayModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Brandnames: [''],
      Name: ['', Validators.required],
      ApiUrl: ['', Validators.required],
      Username: ['', Validators.required],
      Password: ['', Validators.required],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SmsGatewayModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/sms/template/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
