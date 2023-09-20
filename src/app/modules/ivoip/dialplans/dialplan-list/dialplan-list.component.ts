import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { PbxDialplanModel } from '../../../../models/pbx-dialplan.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { LocalDataSource } from 'ng2-smart-table';
import { PbxDialplanDetailModel } from '../../../../models/pbx-dialplan-detail.model';
import { DialplanFormComponent } from '../dialplan-form/dialplan-form.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-dialplan-list',
  templateUrl: './dialplan-list.component.html',
  styleUrls: ['./dialplan-list.component.scss'],
})
export class DialplanListComponent extends IvoipBaseListComponent<PbxDialplanModel> implements OnInit {

  componentName = 'DialplanListComponent';
  formPath = '/ivoip/dialplans/form';
  apiPath = '/ivoip/dialplans';
  idKey = 'dialplan_uuid';

  formDialog = DialplanFormComponent;

  inboundSource: LocalDataSource = new LocalDataSource();
  outboundSource: LocalDataSource = new LocalDataSource();

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
      //   perPage: 99999,
      // },
      columns: {
        // app_name: {
        //   title: 'Ứng dụng',
        //   type: 'string',
        //   width: '10%',
        // },
        dialplan_name: {
          title: 'Tên',
          type: 'string',
          width: '20%',
        },
        dialplan_number: {
          title: 'Số',
          type: 'string',
          width: '20%',
        },
        dialplan_context: {
          title: 'Context',
          type: 'string',
          width: '20%',
        },
        dialplan_description: {
          title: 'Mô tả',
          type: 'string',
          width: '20%',
        },
        dialplan_enabled: {
          title: 'Kích hoạt',
          type: 'string',
          width: '10%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Get data from api and push to list */
  loadList(callback?: (list: PbxDialplanDetailModel[]) => void) {
    super.loadList(list => {
      this.inboundSource.load(list.filter(item => item['dialplan_type'] === 'inbound').map((d, i) => {
        d['No'] = i + 1;
        return d;
      }));
      this.outboundSource.load(list.filter(item => item['dialplan_type'] === 'outbound').map((d, i) => {
        d['No'] = i + 1;
        return d;
      }));
      if (callback) callback(list);
    });
  }

}
