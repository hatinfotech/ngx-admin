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
      // url: params => {
      //   return this.apiService.buildApiUrl('/sms/gateway-groups', { filter_Name: params['term'] });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/sms/gateway-groups', { filter_Name: params['term'] }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
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
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<SmsTemplateFormComponent>,
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
    params['includeGroups'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: SmsGatewayModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Groups: [''],
      Type: ['', Validators.required],
      Name: ['', Validators.required],
      Brandnames: [''],
      Description: [''],
      ApiUrl: [''],
      ApiToken: [''],
      Username: [''],
      Password: [''],
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
