import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxPstnNumberModel } from '../../../../models/pbx-pstn-number.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { PbxDialplanDetailModel } from '../../../../models/pbx-dialplan-detail.model';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';

@Component({
  selector: 'ngx-pstn-number-form',
  templateUrl: './pstn-number-form.component.html',
  styleUrls: ['./pstn-number-form.component.scss'],
})
export class PstnNumberFormComponent extends IvoipBaseFormComponent<PbxPstnNumberModel> implements OnInit {

  componentName = 'PstnNumberFormComponent';
  idKey = 'destination_uuid';
  apiPath = '/ivoip/pstn-numbers';
  baseFormUrl = '/ivoip/pstn-numbers/form';

  privateActiveDomain: string;
  privateDomainList: {
    id: string,
    text: string,
    domain: PbxDomainModel,
  }[];
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
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ivoipService: IvoipService,
    public ref?: NbDialogRef<PstnNumberFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, ivoipService, ref);
  }

  ngOnInit() {
    this.restrict();
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
          this.privateDomainList = domainList;
          this.privateActiveDomain = this.ivoipService.getPbxActiveDomainUuid();
          super.ngOnInit();
        });

      });
  }

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
    super.onAddFormGroup(index, newForm, formData);
    // Event

    // Domains form load
    if (formData && formData.dialplan_details) {
      formData.dialplan_details.forEach(dialplanDetail => {
        (newForm.get('dialplan_details') as FormArray).push(this.makeNewDialplanDetailFormGroup(dialplanDetail));
      });
    }

    const destinationAccountCode = newForm.get('destination_accountcode');
    const destinationNumber = newForm.get('destination_number');
    destinationAccountCode.valueChanges.subscribe(value => {
      if (!this.isProcessing && this.id.length === 0) {
        destinationNumber.setValue('(\\d{1,3}' + value.replace(/^0/, '') + ')');
      }
    });

  }
  onRemoveFormGroup(index: number): void {

  }
  // goback(): false {
  //   this.router.navigate(['/ivoip/pstn-numbers/list']);
  //   return false;
  // }
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
