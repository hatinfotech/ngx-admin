import { Component, OnInit } from '@angular/core';
import { PbxDeviceModel } from '../../../../models/pbx-device.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService, PbxDomainSelection } from '../../ivoip-service';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';

@Component({
  selector: 'ngx-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent extends IvoipBaseListComponent<PbxDeviceModel> implements OnInit {

  componentName = 'DeviceListComponent';
  formPath = '/ivoip/devices/form';
  apiPath = '/ivoip/devices';
  idKey = 'device_uuid';

  domainList: PbxDomainSelection[] = [];
  select2OptionForDoaminList = this.ivoipService.getDomainListOption();
  // activePbxDoamin: string;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    // add: {
    //   addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    // pager: {
    //   display: true,
    //   perPage: 100,
    // },
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
  });

  ngOnInit() {
    this.restrict();
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      // this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();
      super.ngOnInit();
    });
  }

  getList(callback: (list: PbxDeviceModel[]) => void) {
    super.getList(list => callback(list.map((item: any) => {
      // item['qr_code'] = '<i icon="qrcode" class="fa fa-qrcode"></i>';
      return item;
    })));
  }

  onReloadBtnClick(): false {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();
      this.loadList();
    });
    return false;
  }

  onGenerateQRCodeBtnClick(): false {
    return false;
  }

  // onChangeDomain(event: PbxDomainModel) {
  //   console.info(event);
  //   if (event['id']) {
  //     // this.ivoipService.setPbxActiveDomain(event['id']);
  //     this.ivoipService.onChangeDomain(event);
  //     this.activePbxDoamin = event['id'];
  //     this.loadList();
  //   }
  // }

}
