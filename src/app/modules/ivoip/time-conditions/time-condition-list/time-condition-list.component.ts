import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { PbxDialplanModel } from '../../../../models/pbx-dialplan.model';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { PbxDialplanDetailModel } from '../../../../models/pbx-dialplan-detail.model';

@Component({
  selector: 'ngx-time-condition-list',
  templateUrl: './time-condition-list.component.html',
  styleUrls: ['./time-condition-list.component.scss']
})
export class TimeConditionListComponent extends IvoipBaseListComponent<PbxDialplanModel> implements OnInit {

  componentName = 'TimeConditionListComponent';
  formPath = '/ivoip/time-conditions/form';
  apiPath = '/ivoip/time-conditions';
  idKey = 'dialplan_uuid';

  inboundSource: LocalDataSource = new LocalDataSource();
  outboundSource: LocalDataSource = new LocalDataSource();

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
      perPage: 99999,
    },
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
  };

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
