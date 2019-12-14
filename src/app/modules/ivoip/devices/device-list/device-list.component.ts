import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { PbxDeviceModel } from '../../../../models/pbx-device.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent extends DataManagerListComponent<PbxDeviceModel> implements OnInit {

  formPath = '/ivoip/devices/form';
  apiPath = '/ivoip/devices';
  idKey = 'device_uuid';

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    iconsLibrary: NbIconLibraries,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
  }

  editing = {};
  rows = [];

  settings = {
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 99999,
    },
    columns: {
      device_mac_address: {
        title: 'Mã mac',
        type: 'string',
        width: '30%',
      },
      device_template: {
        title: 'Template',
        type: 'string',
        width: '20%',
      },
      device_description: {
        title: 'Mô tả',
        type: 'string',
        width: '50%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
    },
  };

  ngOnInit() {
    super.ngOnInit();
  }

  getList(callback: (list: PbxDeviceModel[]) => void) {
    super.getList(list => callback(list.map((item: any) => {
      // item['qr_code'] = '<i icon="qrcode" class="fa fa-qrcode"></i>';
      return item;
    })));
  }

  onReloadBtnClick(): false {
    this.loadList();
    return false;
  }

  onGenerateQRCodeBtnClick(): false {
    return false;
  }

}
