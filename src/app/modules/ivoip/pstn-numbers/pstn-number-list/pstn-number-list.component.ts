import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { PbxPstnNumberModel } from '../../../../models/pbx-pstn-number.model';

@Component({
  selector: 'ngx-pstn-number-list',
  templateUrl: './pstn-number-list.component.html',
  styleUrls: ['./pstn-number-list.component.scss']
})
export class PstnNumberListComponent extends IvoipBaseListComponent<PbxPstnNumberModel> implements OnInit {

  formPath = '/ivoip/pstn-numbers/form';
  apiPath = '/ivoip/pstn-numbers';
  idKey = 'destination_uuid';

  domainList: { id?: string, text: string, children: any[] }[] = [];
  select2OptionForDoaminList = this.ivoipService.getDomainListOption();
  activePbxDoamin: string;

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
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
      perPage: 50,
    },
    columns: {
      destination_number: {
        title: 'Số điện thoại',
        type: 'string',
        width: '50%',
      },
      pbx: {
        title: 'Tổng đài',
        type: 'string',
        width: '20%',
      },
      domain: {
        title: 'Domain',
        type: 'string',
        width: '30%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
    },
  };

  ngOnInit() {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      this.activePbxDoamin = this.ivoipService.getPbxActiveDomain();
      super.ngOnInit();
    });
  }

  getList(callback: (list: PbxPstnNumberModel[]) => void) {
    super.getList(list => callback(list.map((item: any) => {
      // item['qr_code'] = '<i icon="qrcode" class="fa fa-qrcode"></i>';
      return item;
    })));
  }

  onReloadBtnClick(): false {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      this.activePbxDoamin = this.ivoipService.getPbxActiveDomain();
      this.loadList();
    });
    return false;
  }

  onGenerateQRCodeBtnClick(): false {
    return false;
  }

  onChangeDomain(event: PbxDomainModel) {
    console.info(event);
    if (event['id']) {
      // this.ivoipService.setPbxActiveDomain(event['id']);
      this.ivoipService.onChangeDomain(event);
      this.activePbxDoamin = event['id'];
      this.loadList();
    }
  }

}
