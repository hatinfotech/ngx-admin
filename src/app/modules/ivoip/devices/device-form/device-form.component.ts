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
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
})
export class DeviceFormComponent extends IvoipBaseFormComponent<PbxDeviceModel> implements OnInit {

  idKey = 'device_uuid';
  apiPath = '/ivoip/devices';
  baseFormUrl = '/ivoip/devices/form';

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

  extensionList: PbxExtensionModel[];
  extensionListConfig = {
    placeholder: 'Chọn số nội bộ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'extension',
      text: 'description',
    },
  };

  privateDmainList: { id?: string, text: string }[] = [];
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

    // Load domain list
    this.ivoipService.getActiveDomainList(domainList => {
      this.privateDmainList = this.convertOptionList(domainList, 'DomainId', 'DomainName');

      // Get extension list
      this.apiService.get<PbxExtensionModel[]>('/ivoip/extensions', { select: 'extension_uuid,extension,description', domainId: this.ivoipService.getPbxActiveDomainUuid() }, extList => {
        this.extensionList = this.convertOptionList(extList, 'extension', 'description');

        // Get device vendor templates
        this.apiService.get<PbxDeviceVendorModel[]>('/ivoip/device-vendors', { limit: 99999, domainId: this.activePbxDoamin, includeTemplates: true }, list => {
          this.templateList = list.map(item => {

            return {
              text: item.name, children: item.templates.map(itemc => {
                return { id: itemc, text: itemc };
              }),
            };
          });
          super.ngOnInit();
        });
      });
    });


  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxDeviceModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeExtension'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxDeviceModel): FormGroup {
    const newForm = this.formBuilder.group({
      device_uuid: [''],
      domain_uuid: [this.activePbxDoamin.split('@')[0], Validators.required],
      device_mac_address: ['', Validators.required],
      device_label: [''],
      extension: [''],
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

  onExtensionChange(event: any, index: number) {
    if (!this.isProcessing && event['id']) {
      this.array.controls[index].get('device_label').setValue(event['text']);
      this.array.controls[index].get('device_description').setValue(event['text']);
    }
  }

  onVendorTemplateChange(event: any, index: number) {
    if (!this.isProcessing && event['id']) {
      const template = event['text'].split('/');
      this.array.controls[index].get('device_vendor').setValue(template[0]);
      this.array.controls[index].get('device_model').setValue(template[1]);
    }
  }

}
