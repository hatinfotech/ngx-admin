import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { EmailGatewayModel } from '../../../../models/email.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { SmsTemplateFormComponent } from '../../../sms/sms-template/sms-template-form/sms-template-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-email-gateway-form',
  templateUrl: './email-gateway-form.component.html',
  styleUrls: ['./email-gateway-form.component.scss'],
})
export class EmailGatewayFormComponent extends DataManagerFormComponent<EmailGatewayModel> implements OnInit {

  componentName: string = 'EmailGatewayFormComponent';
  idKey = 'Code';
  apiPath = '/email-marketing/gateway';
  baseFormUrl = '/email-marketing/gateway/form';

  select2GroupsOption = {
    placeholder: 'Nhóm...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/email-marketing/gateway-groups', { filter_Name: params['term'] });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            delete item['Id'];
            return item;
          }),
        };
      },
    },
  };

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    protected ref: NbDialogRef<EmailGatewayFormComponent>,
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
  executeGet(params: any, success: (resources: EmailGatewayModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    params['includeGroups'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: EmailGatewayModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Groups: [''],
      Type: ['', Validators.required],
      Name: ['', Validators.required],
      Description: [''],
      ApiUrl: [''],
      ApiToken: [''],
      SmtpHost: [''],
      SmtpPort: [''],
      SmtpTransport: [''],
      SmtpUsername: [''],
      SmtpPassword: [''],
      SmtpToken: [''],
      DefaultSenderName: [''],
      DefaultSenderEmail: [''],
      Enabled: [false],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: EmailGatewayModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/email-marketing/template/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
