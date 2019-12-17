import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxPstnNumberModel } from '../../../../models/pbx-pstn-number.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { PbxDialplanDetailModel } from '../../../../models/pbx-dialplan-detail.model';

@Component({
  selector: 'ngx-pstn-number-form',
  templateUrl: './pstn-number-form.component.html',
  styleUrls: ['./pstn-number-form.component.scss'],
})
export class PstnNumberFormComponent extends IvoipBaseFormComponent<PbxPstnNumberModel> implements OnInit {

  idKey = 'destination_uuid';
  apiPath = '/ivoip/pstn-numbers';
  baseFormUrl = '/ivoip/pstn-numbers/form';

  privateActiveDomain: string;
  privateDomainList: { id: string, text: string, Code: string, Name: string }[];
  privateDomainListConfig = {
    placeholder: 'Chọn domain...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'DomainId',
      text: 'DoaminName',
    },
  };

  directionList: { id: string, text: string }[] = [
    {
      id: 'inbound',
      text: 'Inbound',
    },
    {
      id: 'outbound',
      text: 'Outbound',
    },
    {
      id: 'local',
      text: 'Local',
    },
  ];

  // private subcriptions: Subscription[] = [];

  dialplanDetailList: { id?: string, text: string, children?: { id: string, text: string }[] }[] = [];
  dialplanDetailListConfig = {
    placeholder: 'Chọn hành động...',
    allowClear: false,
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
    protected ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService);
  }

  ngOnInit() {

    // Load destination list
    this.apiService.get<{ label: string, name: string, result: { data: { select_label: string, select_value: string }[] } }[]>(
      '/ivoip/dialplan-actions',
      { domainId: this.ivoipService.getPbxActiveDomainUuid() },
      list => {
        this.dialplanDetailList = list.map(group => {
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
          this.privateDomainList = this.convertOptionList(domainList, 'DomainId', 'DomainName');
          this.privateActiveDomain = this.ivoipService.getPbxActiveDomainUuid();
          super.ngOnInit();
        });

      });


    // this.blockActions = [
    //   {
    //     id: 'Reject',
    //     text: 'Reject',
    //     Code: 'Reject',
    //     Name: 'Reject',
    //   },
    //   {
    //     id: 'Busy',
    //     text: 'Busy',
    //     Code: 'Busy',
    //     Name: 'Busy',
    //   },
    //   {
    //     id: 'Hold',
    //     text: 'Hold',
    //     Code: 'Hold',
    //     Name: 'Hold',
    //   },
    // ];
  }

  // /** Execute api get */
  // executeGet(params: any, success: (resources: PbxPstnNumberModel[]) => void, error?: (e: HttpErrorResponse) => void) {
  //   params['includeUsers'] = true;
  //   super.executeGet(params, success, error);
  // }

  // /** Get form data by id from api */
  // getFormData(callback: (data: PbxPstnNumberModel[]) => void) {
  //   this.apiService.get<PbxPstnNumberModel[]>(this.apiPath, { id: this.id, multi: true, includeUsers: true },
  //     data => callback(data),
  //   ), (e: HttpErrorResponse) => {
  //     this.onError(e);
  //   };
  // }

  /** Get data from api and patch data for form */
  // formLoad(formData?: PbxPstnNumberModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PbxPstnNumberModel) => void) {
  //   super.formLoad(formData, (index: number, newForm: FormGroup, fData: PbxPstnNumberModel) => {
  //     formItemLoadCallback(index);
  //   });
  // }

  makeNewFormGroup(data?: PbxPstnNumberModel): FormGroup {
    const newForm = this.formBuilder.group({
      destination_uuid: [''],
      destination_type: ['inbound'],
      destination_number: ['', Validators.required],
      destination_accountcode: ['', Validators.required],
      domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : '', Validators.required],
      destination_record: [true],
      destination_enabled: [true],
      destination_description: [''],
      dialplan_details: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }

    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxPstnNumberModel): void {
    // Event

    // Domains form load
    if (formData && formData.dialplan_details) {
      formData.dialplan_details.forEach(dialplanDetail => {
        (newForm.get('dialplan_details') as FormArray).push(this.makeNewDialplanDetailFormGroup(dialplanDetail));
      });
    }

    newForm.get('destination_accountcode').valueChanges.subscribe(value => {
      newForm.get('destination_number').setValue('(\\d{1,2}' + value.replace(/^0/, '') + ')');
    });

  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/pstn-numbers/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  // Dialplan details
  makeNewDialplanDetailFormGroup(data?: PbxDialplanDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      dialplan_detail_uuid: [''],
      dialplan_detail_data: ['', Validators.required],
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
