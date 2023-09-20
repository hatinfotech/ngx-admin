import { Component, OnInit } from '@angular/core';
import { PbxCallCenterAgentModel } from '../../../../../models/pbx-center-agent.model';
import { IvoipBaseFormComponent } from '../../../ivoip-base-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../../services/common.service';
import { IvoipService } from '../../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxDomainModel } from '../../../../../models/pbx-domain.model';
import { RootServices } from '../../../../../services/root.services';

@Component({
  selector: 'ngx-call-center-agent-form',
  templateUrl: './call-center-agent-form.component.html',
  styleUrls: ['./call-center-agent-form.component.scss'],
})
export class CallCenterAgentFormComponent extends IvoipBaseFormComponent<PbxCallCenterAgentModel> implements OnInit {

  componentName: string = 'CallCenterAgentFormComponent';
  idKey = 'call_center_agent_uuid';
  apiPath = '/ivoip/call-center-agents';
  baseFormUrl = '/ivoip/call-centers/agents/form';

  privateDmainList: { id: string, text: string, domain: PbxDomainModel }[] = [];
  privateDmainListConfig = {
    placeholder: 'Chọn domain...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'DomainId',
      text: 'DomainName',
    },
  };

  actionList: { id?: string, text: string, children?: { id: string, text: string }[] }[] = [];
  actionListConfig = {
    placeholder: 'Chuyển tới...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: { id: 'id', text: 'text' },
  };

  statusList: { id: string, text: string }[] = [
    {
      id: 'Logged Out',
      text: 'Logged Out',
    },
    {
      id: 'Available',
      text: 'Available',
    },
    {
      id: 'Available (On Demand)',
      text: 'Available (On Demand)',
    },
    {
      id: 'On Break',
      text: 'On Break',
    },
  ];

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ivoipService: IvoipService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, ivoipService);
  }

  ngOnInit() {
    this.restrict();
    this.apiService.get<{ label: string, name: string, result: { data: { select_label: string, select_value: string, destination: string, context: string }[] } }[]>(
      '/ivoip/dialplan-actions',
      { domainId: this.ivoipService.getPbxActiveDomainUuid() }, actionList => {
        this.actionList = actionList.filter(item => item.name === 'extensions').map(group => {
          return {
            text: group.label,
            children: group.result ? (group.result.data ? group.result.data.filter(item => item.select_value && item.select_label).map(item => {
              // const valueParses = item.select_value ? item.select_value.replace(':', ' ') : '';
              return {
                id: 'user/' + item.destination + '@' + item.context,
                text: item.select_label,
              };
            }) : null) : null,
          };
        });

        this.ivoipService.getActiveDomainList(domainList => {
          this.privateDmainList = domainList;
          super.ngOnInit();
        });

      });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxCallCenterAgentModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxCallCenterAgentModel): FormGroup {
    const newForm = this.formBuilder.group({
      call_center_agent_uuid: [''],
      domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : '', Validators.required],
      agent_name: ['', Validators.required],
      agent_contact: ['', Validators.required],
      agent_status: ['Available', Validators.required],
      agent_call_timeout: [20, Validators.required],
      agent_no_answer_delay_time: [30, Validators.required],
      // agent_max_no_answer: [0, Validators.required],
      // agent_wrap_up_time: [10, Validators.required],
      // agent_reject_delay_time: [90, Validators.required],
      // agent_busy_delay_time: [90, Validators.required],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxCallCenterAgentModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/call-centers/agents/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
