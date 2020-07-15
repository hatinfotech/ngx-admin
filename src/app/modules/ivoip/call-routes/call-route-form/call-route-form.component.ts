import { Component, OnInit } from '@angular/core';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { PbxFollowMeDestinationModel } from '../../../../models/pbx-follow_me_destination.model';

@Component({
  selector: 'ngx-call-route-form',
  templateUrl: './call-route-form.component.html',
  styleUrls: ['./call-route-form.component.scss'],
})
export class CallRouteFormComponent extends IvoipBaseFormComponent<PbxExtensionModel> implements OnInit {

  componentName = 'CallRouteFormComponent';
  idKey = 'extension_uuid';
  apiPath = '/ivoip/call-routes';
  baseFormUrl = '/ivoip/call-routes/form';

  templateList: { id?: string, text: string, children?: any[] }[];
  templateListConfig = {
    placeholder: 'Chọn template...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'DomainId',
      text: 'DomainName',
    },
  };

  privateDmainList: {
    id: string,
    text: string,
    domain: PbxDomainModel,
  }[] = [];
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

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService);

  }

  ngOnInit() {
    this.restrict();
    // this.ivoipService.getActiveDomainList(domainList => {
    //   this.privateDmainList = domainList;
    //   this.apiService.get<PbxDeviceVendorModel[]>('/ivoip/device-vendors', { limit: 99999, domainId: this.activePbxDoamin, includeTemplates: true }, list => {
    //     this.templateList = list.map(item => {
    //       return {
    //         text: item.name, children: item.templates.map(item2 => {
    //           return { id: item2, text: item2 };
    //         }),
    //       };
    //     });
        super.ngOnInit();
      // });
    // });
    // this.apiService.get<PbxDomainModel[]>('/ivoip/domains', {}, list => {

    // });

    // super.ngOnInit();
  }

  formLoad(formData: PbxExtensionModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PbxExtensionModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Domains form load
      if (itemFormData.follow_me_destinations) {
        itemFormData.follow_me_destinations.forEach(destination => {
          (newForm.get('follow_me_destinations') as FormArray).push(this.makeNewFollowMeFormGroup(destination));
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxExtensionModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    params['includeFollowMeDestinations'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxExtensionModel): FormGroup {
    const newForm = this.formBuilder.group({
      extension_uuid: [''],
      // domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : '', Validators.required],
      extension: this.formBuilder.control({value: '', disabled: true}),
      // password: [''],
      call_group: this.formBuilder.control({value: '', disabled: true}),
      // user_record: ['all'],
      // call_timeout: [30],
      // enabled: [true],
      description: this.formBuilder.control({value: '', disabled: true}),
      forward_all_destination: [''],
      forward_all_enabled: [false],
      forward_busy_destination: [''],
      forward_busy_enabled: [false],
      forward_no_answer_destination: [''],
      forward_no_answer_enabled: [false],
      forward_user_not_registered_destination: [''],
      forward_user_not_registered_enabled: [false],
      follow_me_enabled: [false],
      follow_me_destinations: this.formBuilder.array([]),
      // devices: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  /** Follow me list */
  makeNewFollowMeFormGroup(data?: PbxFollowMeDestinationModel): FormGroup {
    const newForm = this.formBuilder.group({
      follow_me_destination_uuid: [''],
      follow_me_destination: [''],
      follow_me_delay: [0],
      follow_me_timeout: [30],
      follow_me_prompt: [false],
    });

    if (data) {
      // data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    // newForm.disable();

    return newForm;
  }

  getFollowMes(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('follow_me_destinations') as FormArray;
  }

  addFollowMeFormGroup(formGroupIndex: number) {
    this.getFollowMes(formGroupIndex).push(this.makeNewFollowMeFormGroup());
    return false;
  }

  removeFollowMeGroup(formGroupIndex: number, index: number) {
    this.getFollowMes(formGroupIndex).removeAt(index);
    return false;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxExtensionModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }

  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    this.router.navigate(['/ivoip/call-routes/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAutoGenrateExtensionClick(index: number): false {

    this.dialogService.open(DialogFormComponent, {
      context: {
        title: 'Tạo tự động dãy số nội bộ',
        controls: [
          {
            name: 'Length',
            label: 'Số lượng cần tạo',
            placeholder: 'Số lượng cần tạo',
            type: 'text',
          },
        ],
        actions: [
          {
            label: 'Trở về',
            icon: 'back',
            status: 'info',
            action: () => { },
          },
          {
            label: 'Tạo tự động',
            icon: 'generate',
            status: 'success',
            action: (form: FormGroup) => {
              const length = +form.value['Length'];
              const currentValue = this.array.controls[index].value;
              let startExt = +currentValue['extension'];
              for (let i = 1; i < length; i++) {
                startExt++;
                currentValue['extension'] = startExt;
                this.array.push(this.makeNewFormGroup(currentValue));
              }
            },
          },
        ],
      },
    });

    return false;
  }
}
