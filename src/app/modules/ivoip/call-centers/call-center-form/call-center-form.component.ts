import { Component, OnInit } from '@angular/core';
import { PbxCallCenterQueueModel } from '../../../../models/pbx-center-queue.model';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxCallCenterAgentModel } from '../../../../models/pbx-center-agent.model';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-call-center-form',
  templateUrl: './call-center-form.component.html',
  styleUrls: ['./call-center-form.component.scss'],
})
export class CallCenterFormComponent extends IvoipBaseFormComponent<PbxCallCenterQueueModel> implements OnInit {

  componentName = 'CallCenterFormComponent';
  idKey = 'call_center_queue_uuid';
  apiPath = '/ivoip/call-centers';
  baseFormUrl = '/ivoip/call-centers/form';

  privateDmainList: {
    id: string,
    text: string,
    domain: PbxDomainModel,
  }[] = [];
  privateDmainListConfig = {
    placeholder: 'Global',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  gatewaylist: { id: string, text: string }[];

  actionList: { id?: string, text: string, children?: { id: string, text: string }[] }[] = [];
  actionListConfig = {
    placeholder: 'Chuyển tới...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  soundList: { text: string, children: { id: string, text: string }[] }[] = [];
  soundListConfig = {
    placeholder: 'Âm thanh...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  ringbackList: { text: string, children: { id: string, text: string }[] }[] = [];
  ringbackListConfig = {
    placeholder: 'Hồi chuông...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  greetingList: { text: string, children: { id: string, text: string }[] }[] = [];
  greetingListConfig = {
    placeholder: 'Lời chào...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  agentList: { id: string, text: string }[];

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
    public ref: NbDialogRef<CallCenterFormComponent>,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, ivoipService);
  }

  ngOnInit() {
    this.restrict();
    this.apiService.get<{ [id: string]: { id: string, text: string }[] }>('/ivoip/sounds', { domainId: this.ivoipService.getPbxActiveDomainUuid() }, soundList => {
      this.soundList = [
        {
          text: 'Recordings',
          children: soundList['recordings'],
        },
        {
          text: 'Phrases',
          children: soundList['phrases'],
        },
        {
          text: 'Sounds',
          children: soundList['sounds'],
        },
      ];

      this.ringbackList = [
        {
          text: 'Ringback',
          children: soundList['ringtones'],
        },
        {
          text: 'Recordings',
          children: soundList['recordings'].map(item => {
            return {
              id: item['path'] + '/' + item.id,
              text: item.text,
            };
          }),
        },
        {
          text: 'Music on hold',
          children: soundList['music_on_holds'],
        },
      ];

      this.greetingList = [
        {
          text: 'Recordings',
          children: soundList['recordings'],
        },
        {
          text: 'Phrases',
          children: soundList['phrases'],
        },
      ];


      this.apiService.get<{ label: string, name: string, result: { data: { select_label: string, select_value: string }[] } }[]>(
        '/ivoip/dialplan-actions',
        { domainId: this.ivoipService.getPbxActiveDomainUuid() }, actionList => {
          this.actionList = actionList.map(group => {
            return {
              text: group.label,
              children: group.result ? (group.result.data ? group.result.data.filter(item => item.select_value && item.select_label).map(item => {
                return {
                  id: item.select_value,
                  text: item.select_label,
                };
              }) : null) : null,
            };
          });

          this.ivoipService.getActiveDomainList(domainList => {
            this.privateDmainList = domainList;
            this.apiService.get<PbxCallCenterAgentModel[]>('/ivoip/call-center-agents', { domainId: this.ivoipService.getPbxActiveDomainUuid() }, agentList => {
              this.agentList = this.convertOptionList(agentList, 'call_center_agent_uuid', 'agent_name');
              super.ngOnInit();
            });

          });

        });
    });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxCallCenterQueueModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeTiers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxCallCenterQueueModel): FormGroup {
    let activeDomain: PbxDomainModel;
    if (this.ivoipService) {
      activeDomain = this.ivoipService.getActiveDomain();
    }
    // const domain = this.ivoipService ? this.ivoipService.getActiveDomain() : null;
    const newForm = this.formBuilder.group({
      call_center_queue_uuid: [''],
      domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : '', Validators.required],
      queue_name: ['', Validators.required],
      queue_extension: ['', Validators.required],
      queue_greeting: [''],
      queue_strategy: [''],
      queue_moh_sound: ['local_stream://default'],
      queue_record_template: [true],
      queue_max_wait_time: [0],
      queue_max_wait_time_with_no_agent: [90],
      queue_max_wait_time_with_no_agent_time_reached: [30],
      queue_timeout_action: [],
      queue_description: [''],
      call_center_tiers: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxCallCenterQueueModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // Domains form load
    if (formData && formData.call_center_tiers) {
      formData.call_center_tiers.forEach(iveMenuOption => {
        const option = this.makeNewCallCenterAgentFormGroup(iveMenuOption);
        (newForm.get('call_center_tiers') as FormArray).push(option);
      });

    }
    // const domainUuid = newForm.get('domain_uuid');
    // const context = newForm.get('dialplan_context');
    // const type = newForm.get('dialplan_type');
    // domainUuid.valueChanges.subscribe(value => {
    //   if (value && value.domain) {
    //     const domain = this.ivoipService.getActiveDomainByUuid(value.domain.DomainUuid);
    //     if (domain) context.setValue(domain.DomainName);
    //   }
    // });
    // type.valueChanges.subscribe(value => {
    //   if (value === 'inbound') {
    //     context.setValue('public');
    //   }
    // });
  }

  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/call-centers/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }


  // Dialplan details
  makeNewCallCenterAgentFormGroup(data?: PbxCallCenterAgentModel): FormGroup {
    const newForm = this.formBuilder.group({
      call_center_tier_uuid: [''],
      call_center_agent_uuid: ['', Validators.required],
    });

    if (data) {
      newForm.patchValue(data);
    }

    return newForm;
  }

  getCallCenterAgents(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('call_center_tiers') as FormArray;
  }

  addCallCenterAgentGroup(formGroupIndex: number) {
    this.getCallCenterAgents(formGroupIndex).push(this.makeNewCallCenterAgentFormGroup());
    return false;
  }

  removeCallCenterAgentGroup(formGroupIndex: number, index: number) {
    this.getCallCenterAgents(formGroupIndex).removeAt(index);
    return false;
  }
}
