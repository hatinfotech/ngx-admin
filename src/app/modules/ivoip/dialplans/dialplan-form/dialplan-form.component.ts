import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxDialplanModel } from '../../../../models/pbx-dialplan.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../../../services/common.service';
import { PbxDialplanDetailModel } from '../../../../models/pbx-dialplan-detail.model';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { PbxGatewayModel } from '../../../../models/pbx-gateway.model';

@Component({
  selector: 'ngx-dialplan-form',
  templateUrl: './dialplan-form.component.html',
  styleUrls: ['./dialplan-form.component.scss'],
})
export class DialplanFormComponent extends IvoipBaseFormComponent<PbxDialplanModel> implements OnInit {

  componentName = 'DialplanFormComponent';
  idKey = 'dialplan_uuid';
  apiPath = '/ivoip/dialplans';
  baseFormUrl = '/ivoip/dialplans/form';

  privateDmainList: {
    id: string,
    text: string,
    domain: PbxDomainModel,
  }[] = [];
  privateDmainListConfig = {
    placeholder: 'Global',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  gatewaylist: { id: string, text: string }[];

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService);
  }

  // blockActions: { id: string, text: string, Code: string, Name: string }[];
  // select2OptionForBlockActions = {
  //   placeholder: 'Chọn kiểu chặn...',
  //   allowClear: false,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'Code',
  //     text: 'Name',
  //   },
  // };

  ngOnInit() {
    this.restrict();
    this.apiService.get<PbxGatewayModel[]>('/ivoip/gateways', { domainId: this.ivoipService.getPbxActiveDomainUuid() }, gateways => {

      this.gatewaylist = gateways.map(item => {
        return { id: item.gateway_uuid, text: item.gateway };
      });

      this.ivoipService.getActiveDomainList(domainList => {
        this.privateDmainList = domainList;
        super.ngOnInit();
      });
    });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxDialplanModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxDialplanModel): FormGroup {
    // let activeDomain: PbxDomainModel;
    // if (this.ivoipService) {
    //   activeDomain = this.ivoipService.getActiveDomain();
    // }
    const domain = this.ivoipService ? this.ivoipService.getActiveDomain() : null;
    const newForm = this.formBuilder.group({
      dialplan_uuid: [''],
      dialplan_type: ['outbound', Validators.required],
      domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : ''],
      dialplan_context: [domain ? domain.DomainName : ''],
      dialplan_regex: [''],
      dialplan_gateway: [''],
      dialplan_name: [''],
      dialplan_number: [''],
      dialplan_destination: [''],
      dialplan_continue: [''],
      dialplan_order: ['100'],
      dialplan_enabled: [true],
      dialplan_description: [''],
      dialplan_details: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxDialplanModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // Domains form load
    if (formData && formData.dialplan_details) {
      formData.dialplan_details.forEach(dialplanDetail => {
        const detail = this.makeNewDialplanDetailFormGroup(dialplanDetail);
        (newForm.get('dialplan_details') as FormArray).push(detail);
      });

    }
    const domainUuid = newForm.get('domain_uuid');
    const context = newForm.get('dialplan_context');
    const type = newForm.get('dialplan_type');
    domainUuid.valueChanges.subscribe(value => {
      if (value && value.domain) {
        const domain = this.ivoipService.getActiveDomainByUuid(value.domain.DomainUuid);
        if (domain) context.setValue(domain.DomainName);
      }
    });
    type.valueChanges.subscribe(value => {
      if (value === 'inbound') {
        context.setValue('public');
      }
    });
  }

  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/dialplans/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }


  // Dialplan details
  makeNewDialplanDetailFormGroup(data?: PbxDialplanDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      dialplan_detail_uuid: [''],
      dialplan_detail_tag: [''],
      dialplan_detail_type: [''],
      dialplan_detail_data: [''],
      dialplan_detail_break: [''],
      dialplan_detail_inline: [''],
      dialplan_detail_group: [''],
      dialplan_detail_order: [''],
    });

    if (data) {
      // data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    // newForm.disable();

    return newForm;
  }

  getDialplanDetails(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('dialplan_details') as FormArray;
  }

  addDialplanDetailFormGroup(formGroupIndex: number) {
    this.getDialplanDetails(formGroupIndex).push(this.makeNewDialplanDetailFormGroup());
    return false;
  }

  removeDialplanDetailGroup(formGroupIndex: number, index: number) {
    this.getDialplanDetails(formGroupIndex).removeAt(index);
    return false;
  }
}
