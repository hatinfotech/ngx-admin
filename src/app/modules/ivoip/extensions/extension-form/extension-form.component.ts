import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { IvoipService } from '../../ivoip-service';
import { PbxDeviceModel } from '../../../../models/pbx-device.model';
import { PbxDeviceVendorModel } from '../../../../models/pbx-device-vendor.model';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';

@Component({
  selector: 'ngx-extension-form',
  templateUrl: './extension-form.component.html',
  styleUrls: ['./extension-form.component.scss'],
})
export class ExtensionFormComponent extends IvoipBaseFormComponent<PbxExtensionModel> implements OnInit {

  componentName = 'ExtensionFormComponent';
  idKey = 'extension_uuid';
  apiPath = '/ivoip/extensions';
  baseFormUrl = '/ivoip/extensions/form';

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
    public ref?: NbDialogRef<ExtensionFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService, ref);

  }

  ngOnInit() {
    this.restrict();
    this.ivoipService.getActiveDomainList(domainList => {
      this.privateDmainList = domainList;
      this.apiService.get<PbxDeviceVendorModel[]>('/ivoip/device-vendors', { limit: 99999, domainId: this.activePbxDoamin, includeTemplates: true }, list => {
        this.templateList = list.map(item => {
          return {
            text: item.name,
            children: item.templates.map(item2 => {
              return { id: item2, text: item2 };
            }),
          };
        });
        super.ngOnInit();
      });
    });
    this.apiService.get<PbxDomainModel[]>('/ivoip/domains', {}, list => {

    });

    // super.ngOnInit();
  }

  async formLoad(formData: PbxExtensionModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PbxExtensionModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Domains form load
      if (itemFormData.devices) {
        itemFormData.devices.forEach(device => {
          (newForm.get('devices') as FormArray).push(this.makeNewDeviceFormGroup(device));
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
    params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    params['includeUser'] = true;
    params['includeDevices'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxExtensionModel): FormGroup {
    const newForm = this.formBuilder.group({
      extension_uuid: [''],
      domain_uuid: [this.ivoipService ? this.ivoipService.getPbxActiveDomainId() : '', Validators.required],
      extension: ['', Validators.required],
      password: [''],
      call_group: [''],
      user_record: ['all'],
      call_timeout: [30],
      enabled: [true],
      description: [''],
      forward_all_destination: [''],
      forward_all_enabled: [false],
      forward_busy_destination: [''],
      forward_busy_enabled: [false],
      forward_no_answer_destination: [''],
      forward_no_answer_enabled: [false],
      forward_user_not_registered_destination: [''],
      forward_user_not_registered_enabled: [false],
      follow_me_enabled: [false],
      devices: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewDeviceFormGroup(data?: PbxDeviceModel): FormGroup {
    const newForm = this.formBuilder.group({
      device_uuid: this.formBuilder.control({value: '', disabled: true}),
      device_mac_address: this.formBuilder.control({value: '', disabled: true}),
      device_template: this.formBuilder.control({value: '', disabled: true}),
      device_description: this.formBuilder.control({value: '', disabled: true}) ,
    });

    if (data) {
      // data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    // newForm.disable();
    this.updateInitialFormPropertiesCache(newForm);

    return newForm;
  }

  getDevices(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('devices') as FormArray;
  }

  addDeviceFormGroup(formGroupIndex: number) {
    const newForm = this.makeNewDeviceFormGroup();
    this.getDevices(formGroupIndex).push(newForm);
    return false;
  }

  removeDeviceGroup(formGroupIndex: number, index: number) {
    this.getDevices(formGroupIndex).removeAt(index);
    return false;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxExtensionModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  // goback(): false {
  //   this.router.navigate(['/ivoip/extensions/list']);
  //   return false;
  // }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAutoGenrateExtensionClick(index: number): false {

    this.commonService.openDialog(DialogFormComponent, {
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
            action: () => { return true; },
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
              return true;
            },
          },
        ],
      },
    });

    return false;
  }
}
