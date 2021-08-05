import { Component, OnInit } from '@angular/core';
import { MinierpBaseListComponent } from '../../minierp-base-list.component';
import { MiniErpModel } from '../../../../models/minierp.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { MinierpService } from '../../minierp-service.service';
import { SmartTableIconComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { TemperatureHumidityService } from '../../../../@core/mock/temperature-humidity.service';

@Component({
  selector: 'ngx-minierp-list',
  templateUrl: './minierp-list.component.html',
  styleUrls: ['./minierp-list.component.scss'],
})
export class MinierpListComponent extends ServerDataManagerListComponent<MiniErpModel> implements OnInit {

  componentName: string = 'MinierpListComponent';
  formPath = '/minierp/minierps/form';
  apiPath = '/mini-erp/minierps';
  idKey = 'Code';
  reuseDialog = true;
  static _dialog: NbDialogRef<MinierpListComponent>;

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

  stateList: { id: string, text: string }[];
  autoUpdateList: { id: any, text: string }[];
  requireUpdateList: { id: any, text: string }[];
  moduleSettings: { [key: string]: any } = {};
  autoRefresh = false;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public minierpService: MinierpService,
    public ref: NbDialogRef<MinierpListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    return super.init().then(async rs => {
      this.stateList = [
        { id: 'UPDATE_FOLDER_WRITABLE', text: 'Cập nhật quyền ghi cho thư mục' },
        { id: 'CHECK_UPDATE', text: 'Kiểm tra cập nhật' },
        { id: 'DOWNLOAD_UPDATE', text: 'Tải cập nhật' },
        { id: 'EXTRACT_UPDATE', text: 'Giải nến cập nhật' },
        { id: 'UPDATE_SOURCE_STRUCTURE', text: 'Cập nhật cấu trúc thư mục' },
        { id: 'UPDATE_DB', text: 'Cập nhật CSDL' },
        { id: 'UPDATE_PERMISSION', text: 'Cập nhật phân quyền' },
        { id: 'UPDATE_VERSION', text: 'Cập nhật phiên bản' },
        { id: 'UPDATE_SUCCESS', text: 'Cập nhật thành công' },
        { id: 'UPDATE_RUNNING', text: 'Đang cập nhật' },
        { id: 'PREPARE_UPDATE', text: 'Chuẩn bị cập nhật' },
        { id: 'UPDATE_ERROR', text: 'Lỗi cập nhật' },
      ];
      this.autoUpdateList = [
        { id: 'true', text: 'Tự động' },
        { id: 'false', text: 'Thủ công' },
      ];
      this.requireUpdateList = [
        { id: 'true', text: 'Yêu cầu cập nhật' },
        { id: 'false', text: 'Đã cập nhật' },
      ];

      this.actionButtonList.unshift({
        name: 'allowUpdateAll',
        icon: 'arrow-circle-up',
        label: '...',
        status: 'primary',
        title: '...',
        size: 'medium',
        click: () => {
          this.apiService.putPromise(this.apiPath + '/settings', {}, [{
            Name: 'MINIERP_ALLOW_UPDATE',
            Value: (this.moduleSettings && parseInt(this.moduleSettings['MINIERP_ALLOW_UPDATE'])) ? 0 : 1,
          }]).then(rs => {
            this.refresh();
          });
        },
      });
      this.actionButtonList.unshift({
        name: 'setTargetVersion',
        icon: 'pricetags',
        label: 'Cập nhật phiên bản phát hành',
        status: 'success',
        title: 'Cập nhật phiên bản phát hành',
        size: 'medium',
        click: () => {
          this.commonService.openDialog(DialogFormComponent, {
            context: {
              title: 'Cập nhật phiên bản phát hành',
              controls: [
                {
                  name: 'Version',
                  label: 'Phiên bản sẽ được cập nhật',
                  initValue: this.moduleSettings['MINIERP_RELEASE_VERSION'],
                  placeholder: 'Phiên bản sẽ được cập nhật tự động',
                  type: 'text',
                },
              ],
              actions: [
                {
                  label: 'Trở về',
                  icon: 'back',
                  status: 'info',
                  action: () => { },
                },
                {
                  label: 'Cập nhật',
                  icon: 'generate',
                  status: 'success',
                  action: (form: FormGroup) => {
                    this.apiService.putPromise(this.apiPath + '/settings', {}, [{
                      Name: 'MINIERP_RELEASE_VERSION',
                      Value: form.value['Version'],
                    }]).then(rs => {
                      this.refresh();
                    });

                  },
                },
              ],
            },
          });
        },
      });

      this.actionButtonList.unshift({
        name: 'autoRefresh',
        icon: 'refresh',
        label: 'Không tự động làm mới',
        status: 'danger',
        title: 'Không tự động làm mới',
        size: 'medium',
        click: (event: any, option: any) => {
          this.autoRefresh = !this.autoRefresh;
          const autoRefreshBtn = this.actionButtonList.find(f => f.name === 'autoRefresh');
          if (autoRefreshBtn) {
            autoRefreshBtn.label = autoRefreshBtn.title = (this.autoRefresh ? 'Tự động làm mới' : 'Không tự động làm mới');
            autoRefreshBtn.status = this.autoRefresh ? 'primary' : 'danger';
          }
          this.actionButtonList = [...this.actionButtonList];
        },
      });

      this.updateSettingBehavios();

      setInterval(() => {
        if (this.autoRefresh) this.refresh();
      }, 30000);
      return rs;
    });
  }

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
          width: '25%',
        },
        State: {
          title: 'Trạng thái',
          type: 'string',
          width: '10%',
          valuePrepareFunction: (value: string, miniErp: MiniErpModel) => {
            return this.stateList.find(f => f.id === value)?.text || 'UNKNOWN';
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              select2Option: {
                placeholder: 'Trạng thái...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                // multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.stateList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
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
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                placeholder: 'Yêu cầu cập nhật...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                // multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.requireUpdateList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        AutoUpdate: {
          title: 'Tự động C.Nhật',
          type: 'boolean',
          editable: true,
          width: '10%',
          onChange: (value, rowData: MiniErpModel) => {
            // rowData.AutoUpdate = value;
            this.apiService.putPromise<MiniErpModel[]>('/mini-erp/minierps', {}, [{ Code: rowData.Code, AutoUpdate: value }]).then(rs => {
              console.info(rs);
            });
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                placeholder: 'Cập nhật tự động...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                // multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.autoUpdateList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  setUpdateUpdate() {
    this.commonService.openDialog(ShowcaseDialogComponent, {
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

  refresh() {
    this.updateSettingBehavios();
    return super.refresh();
  }

  loadList(callback: (list: MiniErpModel[]) => void) {
    return super.loadList(callback);
  }

  async updateSettingBehavios() {
    return this.apiService.getPromise<{ [key: string]: any }>(this.apiPath + '/settings', {}).then(rs => {
      this.moduleSettings = rs;
      const allowUpdateBtn = this.actionButtonList.find(f => f.name === 'allowUpdateAll');
      if (allowUpdateBtn) {
        allowUpdateBtn.label = allowUpdateBtn.title = (this.moduleSettings && parseInt(this.moduleSettings['MINIERP_ALLOW_UPDATE'])) ? 'Cho phép cập nhật tất cả' : 'Không cho phép cập nhật tất cả';
        allowUpdateBtn.status = (this.moduleSettings && parseInt(this.moduleSettings['MINIERP_ALLOW_UPDATE'])) ? 'primary' : 'danger';
      }
      return rs;
    });
  }

}
