import { Component, OnInit } from '@angular/core';
import { PbxDeviceModel } from '../../../../models/pbx-device.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxDeviceVendorModel } from '../../../../models/pbx-device-vendor.model';

@Component({
  selector: 'ngx-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
})
export class DeviceFormComponent extends IvoipBaseFormComponent<PbxDeviceModel> implements OnInit {

  idKey = 'extension_uuid';
  apiPath = '/ivoip/devices';
  baseFormUrl = '/ivoip/devices/form';

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

  // userRecordActionList: { id: string, text: string }[] = [
  //   {
  //     id: 'all',
  //     text: 'Tất cả',
  //   },
  //   {
  //     id: 'local',
  //     text: 'Nội bộ',
  //   },
  //   {
  //     id: 'inbound',
  //     text: 'Gọi vào',
  //   },
  //   {
  //     id: 'outbound',
  //     text: 'Gọi ra',
  //   },
  //   {
  //     id: '',
  //     text: 'Không ghi âm',
  //   },
  // ];
  // select2OptionForUserRecordActionList = {
  //   placeholder: 'Chọn kểu ghi âm...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'id',
  //     text: 'text',
  //   },
  // };

  ngOnInit() {
    this.apiService.get<PbxDeviceVendorModel[]>('/ivoip/device-vendors', {limit: 99999, domainId: this.activePbxDoamin, includeTemplates: true}, list => {
      this.templateList = list.map(item => {
        return {text: item.name, children: item.templates.map(item => {
          return {id: item, text: item};
        })};
      });
      super.ngOnInit();
    });
  }

  makeNewFormGroup(data?: PbxDeviceModel): FormGroup {
    const newForm = this.formBuilder.group({
      device_uuid: [''],
      domain_uuid: [this.activePbxDoamin, Validators.required],
      device_mac_address: ['', Validators.required],
      device_label: [''],
      device_vendor: [''],
      device_model: [''],
      device_template: ['', Validators.required],
      device_enabled: [true],
      device_description: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxDeviceModel): void { }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/devices/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
