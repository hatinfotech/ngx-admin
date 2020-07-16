import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxIvrMenuModel } from '../../../../models/pbx-ivr-menu.model';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxIvrMenuOptionModel } from '../../../../models/pbx-ivr-menu-option.model';

@Component({
  selector: 'ngx-ivr-menu-form',
  templateUrl: './ivr-menu-form.component.html',
  styleUrls: ['./ivr-menu-form.component.scss'],
})
export class IvrMenuFormComponent extends IvoipBaseFormComponent<PbxIvrMenuModel> implements OnInit {

  componentName = 'IvrMenuFormComponent';
  idKey = 'ivr_menu_uuid';
  apiPath = '/ivoip/ivr-menus';
  baseFormUrl = '/ivoip/ivr-menus/form';

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

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ivoipService: IvoipService,
    public ref?: NbDialogRef<IvrMenuFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService, ref);
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
          children: soundList['recordings'],
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
                // const valueParses = item.select_value ? item.select_value.replace(':', ' ') : '';
                return {
                  id: item.select_value,
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
    });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxIvrMenuModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeOptions'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxIvrMenuModel): FormGroup {
    let activeDomain: PbxDomainModel;
    if (this.ivoipService) {
      activeDomain = this.ivoipService.getActiveDomain();
    }
    // const domain = this.ivoipService ? this.ivoipService.getActiveDomain() : null;
    const newForm = this.formBuilder.group({
      ivr_menu_uuid: [''],
      domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : ''],
      ivr_menu_name: ['', Validators.required],
      ivr_menu_extension: ['', Validators.required],
      ivr_menu_greet_long: [''],
      ivr_menu_greet_short: [''],
      ivr_menu_timeout: [3000, Validators.required],
      ivr_menu_exit_action: [''],
      ivr_menu_direct_dial: [false],
      ivr_menu_ringback: ['local_stream://default'],
      ivr_menu_invalid_sound: ['ivr/ivr-that_was_an_invalid_entry.wav'],
      ivr_menu_exit_sound: [''],
      ivr_menu_description: [''],
      ivr_menu_enabled: [true],
      ivr_menu_options: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxIvrMenuModel): void {
    super.onAddFormGroup(index, newForm, formData);
    // Domains form load
    if (formData && formData.ivr_menu_options) {
      formData.ivr_menu_options.forEach(iveMenuOption => {
        const option = this.makeNewIvrMenuOptionFormGroup(iveMenuOption);
        (newForm.get('ivr_menu_options') as FormArray).push(option);
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
  // goback(): false {
  //   this.router.navigate(['/ivoip/ivr-menus/list']);
  //   return false;
  // }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }


  // Dialplan details
  makeNewIvrMenuOptionFormGroup(data?: PbxIvrMenuOptionModel): FormGroup {
    const newForm = this.formBuilder.group({
      ivr_menu_option_uuid: [''],
      ivr_menu_option_digits: ['', Validators.required],
      ivr_menu_option_param: ['', Validators.required],
      ivr_menu_option_description: [''],
    });

    if (data) {
      // data['Name_old'] = data.Name;
      data['ivr_menu_option_param'] = data['ivr_menu_option_param'].replace('transfer ', 'transfer:');
      newForm.patchValue(data);
    }
    // newForm.disable();

    return newForm;
  }

  getIvrMenuOptions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('ivr_menu_options') as FormArray;
  }

  addIvrMenuOptionGroup(formGroupIndex: number) {
    this.getIvrMenuOptions(formGroupIndex).push(this.makeNewIvrMenuOptionFormGroup());
    return false;
  }

  removeIvrMenuOptionGroup(formGroupIndex: number, index: number) {
    this.getIvrMenuOptions(formGroupIndex).removeAt(index);
    return false;
  }
}
