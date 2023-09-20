import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { PbxPstnNumberModel } from '../../../../models/pbx-pstn-number.model';
import { PstnNumberFormComponent } from '../pstn-number-form/pstn-number-form.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-pstn-number-list',
  templateUrl: './pstn-number-list.component.html',
  styleUrls: ['./pstn-number-list.component.scss'],
})
export class PstnNumberListComponent extends IvoipBaseListComponent<PbxPstnNumberModel> implements OnInit {

  componentName = 'PstnNumberListComponent';
  formPath = '/ivoip/pstn-numbers/form';
  apiPath = '/ivoip/pstn-numbers';
  idKey = 'destination_uuid';
  formDialog = PstnNumberFormComponent;

  domainList: { id?: string, text: string, children: any[] }[] = [];
  select2OptionForDoaminList = this.ivoipService.getDomainListOption();
  // activePbxDoamin: string;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ivoipService);
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
      //   perPage: 50,
      // },
      columns: {
        destination_type: {
          title: 'Loại',
          type: 'string',
          width: '10%',
        },
        destination_accountcode: {
          title: 'Số đại diện',
          type: 'string',
          width: '20%',
        },
        destination_number: {
          title: 'Mẫu nhận diện',
          type: 'string',
          width: '20%',
        },
        destination_description: {
          title: 'Mô tả',
          type: 'string',
          width: '40%',
        },
        destination_enabled: {
          title: 'Kích hoạt',
          type: 'string',
          width: '10%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    // this.ivoipService.loadDomainList(domains => {
    //   this.domainList = domains;
    // this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();
    super.ngOnInit();
    // });
  }

  // getList(callback: (list: PbxPstnNumberModel[]) => void) {
  //   super.getList(list => callback(list.map((item: any) => {
  //     // item['qr_code'] = '<i icon="qrcode" class="fa fa-qrcode"></i>';
  //     return item;
  //   })));
  // }

  // onReloadBtnClick(): false {
  //   this.ivoipService.loadDomainList(domains => {
  //     this.domainList = domains;
  //     this.activePbxDoamin = this.ivoipService.getPbxActiveDomain();
  //     this.loadList();
  //   });
  //   return false;
  // }

  // onGenerateQRCodeBtnClick(): false {
  //   return false;
  // }

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
