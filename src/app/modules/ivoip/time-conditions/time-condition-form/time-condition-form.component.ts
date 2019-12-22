import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxDialplanModel } from '../../../../models/pbx-dialplan.model';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { PbxGatewayModel } from '../../../../models/pbx-gateway.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxDialplanDetailModel } from '../../../../models/pbx-dialplan-detail.model';

@Component({
  selector: 'ngx-time-condition-form',
  templateUrl: './time-condition-form.component.html',
  styleUrls: ['./time-condition-form.component.scss'],
})
export class TimeConditionFormComponent extends IvoipBaseFormComponent<PbxDialplanModel> implements OnInit {

  idKey = 'dialplan_uuid';
  apiPath = '/ivoip/time-conditions';
  baseFormUrl = '/ivoip/time-conditions/form';

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

  weekList: { id: string, text: string }[] = [
    {
      id: '1',
      text: 'Chủ nhật',
    },
    {
      id: '2',
      text: 'Thứ hai',
    },
    {
      id: '3',
      text: 'Thứ ba',
    },
    {
      id: '4',
      text: 'Thứ tư',
    },
    {
      id: '5',
      text: 'Thư năm',
    },
    {
      id: '6',
      text: 'Thứ sáu',
    },
    {
      id: '7',
      text: 'Thứ bảy',
    },
  ];

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

    this.ivoipService.getActiveDomainList(domainList => {
      this.privateDmainList = domainList;

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

          super.ngOnInit();
        });
    });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxDialplanModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeTimeConditions'] = true;
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
      // dialplan_type: ['', Validators.required],
      domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : ''],
      // dialplan_context: [domain ? domain.DomainName : ''],
      // dialplan_regex: [''],
      // dialplan_gateway: [''],
      dialplan_name: [''],
      dialplan_number: [''],
      // dialplan_destination: [''],
      // dialplan_continue: [''],
      dialplan_order: ['300'],
      dialplan_enabled: [true],
      // dialplan_description: [''],

      day_of_week_start: ['2'],
      day_of_week_end: ['6'],
      time_of_morning_start: ['07:30'],
      time_of_morning_end: ['11:30'],
      time_of_afternoon_start: ['13:15'],
      time_of_afternoon_end: ['17:30'],
      dialplan_action: [''],
      dialplan_anti_action: [''],

    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxDialplanModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // Domains form load
    // if (formData && formData.dialplan_details) {
    //   formData.dialplan_details.forEach(dialplanDetail => {
    //     const detail = this.makeNewDialplanDetailFormGroup(dialplanDetail);
    //     (newForm.get('dialplan_details') as FormArray).push(detail);
    //   });

    // }
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
    this.router.navigate(['/ivoip/time-conditions/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }



}
