import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';

@Component({
  selector: 'ngx-extension-form',
  templateUrl: './extension-form.component.html',
  styleUrls: ['./extension-form.component.scss']
})
export class ExtensionFormComponent extends DataManagerFormComponent<PbxExtensionModel> implements OnInit {

  idKey = 'extension_uuid';
  apiPath = '/ivoip/extensions';
  baseFormUrl = '/ivoip/extensions/form';

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

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

  domainList: { id: string, text: string }[] = [];
  select2OptionForDoaminList = {
    placeholder: 'Chọn domain...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };


  ngOnInit() {

    this.apiService.get<PbxDomainModel[]>('/ivoip/domains', { limit: 999999 }, list => {
      this.domainList = this.convertOptionList(list, 'domain_uuid', 'domain_name');
      super.ngOnInit();
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: PbxExtensionModel[]) => void) {
    this.apiService.get<PbxExtensionModel[]>(this.apiPath, { id: this.id, multi: true, includeUser: true, includeDevices: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: PbxExtensionModel): FormGroup {
    const newForm = this.formBuilder.group({
      // call_block_uuid_old: [''],
      extension_uuid: [''],
      domain_uuid: ['', Validators.required],
      extension: ['', Validators.required],
      password: [''],
      call_group: [''],
      user_record: ['all'],
      call_timeout: [30],
      enabled: [true],
      description: [''],
    });
    if (data) {
      //   data[this.idKey + '_old'] = data[this.idKey];
      newForm.patchValue(data);
    }
    return newForm;
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
