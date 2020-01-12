import { Component, OnInit } from '@angular/core';
import { MinierpBaseListComponent } from '../../minierp-base-list.component';
import { MiniErpModel } from '../../../../models/minierp.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { MinierpService } from '../../minierp-service.service';
import { SmartTableIconComponent } from '../../../../lib/custom-element/smart-table/smart-table-checkbox.component';

@Component({
  selector: 'ngx-minierp-list',
  templateUrl: './minierp-list.component.html',
  styleUrls: ['./minierp-list.component.scss'],
})
export class MinierpListComponent extends MinierpBaseListComponent<MiniErpModel> implements OnInit {

  componentName: string = 'MinierpListComponent';
  formPath = '/minierp/minierps/form';
  apiPath = '/mini-erp/minierps';
  idKey = 'Code';

  stateMap: { [key: string]: string } = {
    'DOWNLOAD_UPDATE': 'UPDATING',
    'EXTRACT_UPDATE': 'UPDATING',
    'UPDATE_SOURCE_STRUCTURE': 'UPDATING',
    'UPDATE_FOLDER_WRITABLE': 'UPDATING',
    'UPDATE_DB': 'UPDATING',
    'UPDATE_PERMISSION': 'UPDATING',
    'UPDATE_VERSION': 'UPDATING',
    'UPDATE_RUNNING': 'UPDATING',
    'CHECK_UPDATE': 'UPDATED',
    'UPDATE_ERROR': 'UPDATEERROR',
    'PREPARE_UPDATE': 'PREPAREUPDATE',
  };

  settings = this.configSetting({
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    add: this.configAddButton(),
    edit: this.configEditButton(),
    delete: this.configDeleteButton(),
    pager: this.configPaging(),
    columns: {
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '20%',
      },
      LastUpdate: {
        title: 'Câp nhật lần cuối',
        type: 'string',
        width: '10%',
      },
      Version: {
        title: 'Phiên bản',
        type: 'string',
        width: '10%',
      },
      LastLog: {
        title: 'Nhật ký',
        type: 'string',
        width: '30%',
      },
      State: {
        title: 'Trạng thái',
        type: 'string',
        width: '10%',
      },
      RequireUpdate: {
        title: 'C.Nhật',
        type: 'custom',
        width: '5%',
        renderComponent: SmartTableIconComponent,
        onComponentInitFunction: (instance: SmartTableIconComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'arrow-circle-up';
          instance.label = '';
          // instance.display = true;
          instance.status = 'warning';
          instance.valueChange.subscribe((info: { value: any, row: any }) => {
            const state = info.row['State'] ? this.stateMap[info.row['State']] : '';

            if (state === 'UPDATEERROR') {
              instance.status = 'danger';
              instance.icon = 'close-circle';
            } else if (state === 'UPDATING') {
              instance.status = 'danger';
              instance.icon = 'arrow-circle-up';
            } else if (state === 'PREPAREUPDATE') {
              instance.status = 'primary';
              instance.icon = 'clock';
            } else {

              if (info.value) {
                instance.status = 'warning';
                instance.icon = 'arrow-circle-up';
              } else {
                instance.status = 'success';
                instance.icon = 'checkmark-circle-2';
              }

            }
          });
          instance.click.subscribe(async (row: MiniErpModel) => {
          });
        },
      },
      Enabled: {
        title: 'KH',
        type: 'boolean',
        editable: false,
        width: '5%',
      },
    },
  });

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    public minierpService: MinierpService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, minierpService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

}
