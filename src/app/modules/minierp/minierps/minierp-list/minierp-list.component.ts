import { Component, OnInit } from '@angular/core';
import { MinierpBaseListComponent } from '../../minierp-base-list.component';
import { MiniErpModel } from '../../../../models/minierp.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { MinierpService } from '../../minierp-service.service';
import { SmartTableIconComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';

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

            // if (!info.row['AutoUpdate']) {
            //   instance.status = 'disabled';
            //   instance.icon = 'close-circle';
            // } else {

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
            // }
          });
          instance.click.subscribe(async (row: MiniErpModel) => {
          });
        },
      },
      AutoUpdate: {
        title: 'KH',
        type: 'boolean',
        editable: true,
        width: '5%',
        onChange: (value, rowData: MiniErpModel) => {
          // rowData.AutoUpdate = value;
          this.apiService.putPromise<MiniErpModel[]>('/mini-erp/minierps', {}, [{ Code: rowData.Code, AutoUpdate: value }]).then(rs => {
            console.info(rs);
          });
        },
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

  setUpdateUpdate() {
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Mini-ERP',
        content: 'Đặt chế độ tự động cập nhật cho các site đã chọn',
        actions: [
          {
            label: 'Tự động',
            icon: 'auto',
            status: 'success',
            action: () => {
              const data: MiniErpModel[] = this.selectedIds.map(i => {
                return { Code: i, AutoUpdate: true };
              });
              this.apiService.putPromise<MiniErpModel[]>('/mini-erp/minierps', {}, data).then(rs => this.refresh());
            },
          },
          {
            label: 'Trở về',
            icon: 'back',
            status: 'primary',
            action: () => {

            },
          },
          {
            label: 'Thủ công',
            icon: 'manual',
            status: 'warning',
            action: () => {
              const data: MiniErpModel[] = this.selectedIds.map(i => {
                return { Code: i, AutoUpdate: false };
              });
              this.apiService.putPromise<MiniErpModel[]>('/mini-erp/minierps', {}, data).then(rs => this.refresh());
             },
          },
        ],
      },
    });
  }

}
