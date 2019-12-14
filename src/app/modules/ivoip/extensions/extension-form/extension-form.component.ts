import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { IvoipService } from '../../ivoip-service';
import { PbxDeviceModel } from '../../../../models/pbx-device.model';
import { PbxDeviceVendorModel } from '../../../../models/pbx-device-vendor.model';

@Component({
  selector: 'ngx-extension-form',
  templateUrl: './extension-form.component.html',
  styleUrls: ['./extension-form.component.scss'],
})
export class ExtensionFormComponent extends IvoipBaseFormComponent<PbxExtensionModel> implements OnInit {

  idKey = 'extension_uuid';
  apiPath = '/ivoip/extensions';
  baseFormUrl = '/ivoip/extensions/form';

  templateList: {id?: string, text: string, children?: any[]}[];
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

  userRecordActionList: { id: string, text: string }[] = [
    {
      id: 'all',
      text: 'Tất cả',
    },
    {
      id: 'local',
      text: 'Nội bộ',
    },
    {
      id: 'inbound',
      text: 'Gọi vào',
    },
    {
      id: 'outbound',
      text: 'Gọi ra',
    },
    {
      id: '',
      text: 'Không ghi âm',
    },
  ];
  select2OptionForUserRecordActionList = {
    placeholder: 'Chọn kểu ghi âm...',
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
    protected ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService);

  }

  ngOnInit() {
    this.apiService.get<PbxDeviceVendorModel[]>('/ivoip/device-vendors', {limit: 99999, domainId: this.activePbxDoamin, includeTemplates: true}, list => {
      this.templateList = list.map(item => {
        return {text: item.name, children: item.templates.map(item => {
          return {id: item, text: item};
        })};
      });
      super.ngOnInit();
    });
    // super.ngOnInit();
  }

  formLoad(formData: PbxExtensionModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PbxExtensionModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

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
    params['domainId'] = this.ivoipService.getPbxActiveDomain();
    params['includeUser'] = true;
    params['includeDevices'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxExtensionModel): FormGroup {
    const newForm = this.formBuilder.group({
      extension_uuid: [''],
      domain_uuid: [this.activePbxDoamin, Validators.required],
      extension: ['', Validators.required],
      password: [''],
      call_group: [''],
      user_record: ['all'],
      call_timeout: [30],
      enabled: [true],
      description: [''],
      devices: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  makeNewDeviceFormGroup(data?: PbxDeviceModel): FormGroup {
    const newForm = this.formBuilder.group({
      device_uuid: ['', Validators.required],
      device_mac_address: ['', Validators.required],
      device_template: ['', Validators.required],
      device_description: [''],
    });

    if (data) {
      // data['Name_old'] = data.Name;
      newForm.patchValue(data);
    }
    // newForm.disable();

    return newForm;
  }

  getDevices(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('devices') as FormArray;
  }

  addDeviceFormGroup(formGroupIndex: number) {
    this.getDevices(formGroupIndex).push(this.makeNewDeviceFormGroup());
    return false;
  }

  removeDeviceGroup(formGroupIndex: number, index: number) {
    this.getDevices(formGroupIndex).removeAt(index);
    return false;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxExtensionModel): void { }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    this.router.navigate(['/ivoip/extensions/list']);
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
          }
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
