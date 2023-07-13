import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../app.module';
import { SmartTableButtonComponent } from '../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { PageModel } from '../../../models/page.model';
import { ProcessMap } from '../../../models/process-map.model';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DialogFormComponent } from '../../dialog/dialog-form/dialog-form.component';
import { ShowcaseDialogComponent } from '../../dialog/showcase-dialog/showcase-dialog.component';
import { MobileAppService } from '../../mobile-app/mobile-app.service';
import { CoreConnectionFormComponent } from '../core-connection-form/core-connection-form.component';

@Component({
  selector: 'ngx-core-connection-list',
  templateUrl: './core-connection-list.component.html',
  styleUrls: ['./core-connection-list.component.scss']
})
export class CoreConnectionListComponent extends ServerDataManagerListComponent<PageModel> implements OnInit {

  componentName: string = 'CoreConnectionListComponent';
  formPath = '/core-connection/form';
  apiPath = '/core-connection/connections';
  idKey = 'Code';
  formDialog = CoreConnectionFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  cycleMap: { [key: string]: string };
  stateList: { id: string, text: string }[];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CoreConnectionListComponent>,
    public mobileAppService: MobileAppService
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.cms.waitForReady();
    this.cycleMap = {
      MONTHLY: this.cms.translateText('Common.monthly'),
      YEARLY: this.cms.translateText('Common.yearly'),
    };
    this.stateList = [
      {
        id: 'ACTIVE',
        text: this.cms.translateText('Common.activated'),
      },
      {
        id: 'INACTIVE',
        text: this.cms.translateText('Common.inactivated'),
      },
      {
        id: 'EXPIREDSOON',
        text: this.cms.translateText('Common.expiredSoon'),
      },
      {
        id: 'OVEREXPIRED',
        text: this.cms.translateText('Common.overExpired'),
      },
      {
        id: 'EXPIRED',
        text: this.cms.translateText('Common.expired'),
      },
    ];
    return super.init().then(rs => {

      // Push product, categories, groups and units to collaborator platform
      this.actionButtonList.unshift({
        type: 'button',
        name: 'generateConnectionString',
        label: this.cms.translateText('Tạo chuỗi kết nối'),
        icon: 'cloud-upload-outline',
        status: 'danger',
        size: 'medium',
        title: this.cms.translateText('Tạo chuỗi kết nối'),
        click: () => {
          this.apiService.postPromise(this.apiPath, { generateConnectionString: true }, []).then(rs => {
            this.cms.showDialog('Chuỗi kết nối core', rs['data'], [
              {
                label: 'Đóng',
                status: 'basic',
                action: () => {

                },
              },
              {
                label: 'Copy',
                status: 'success',
                action: () => {

                },
              },
            ])
          });
        },
      });

      this.actionButtonList.unshift({
        type: 'button',
        name: 'generateConnectionString',
        label: this.cms.translateText('Thêm kết nối'),
        icon: 'link-2-outline',
        status: 'primary',
        size: 'medium',
        title: this.cms.translateText('Thêm kết nối'),
        click: () => {
          this.cms.openDialog(DialogFormComponent, {
            context: {
              title: 'Kết nối core',
              cardStyle: { width: '450px' },
              controls: [
                {
                  name: 'ConnectionString',
                  label: 'Chuỗi kết nối',
                  initValue: '',
                  placeholder: 'Chuỗi kết nối được cung cấp bởi core cần kết nối',
                  type: 'textarea',
                },
              ],
              actions: [
                {
                  label: 'Trở về',
                  icon: 'back',
                  status: 'info',
                  action: async () => { return true },
                },
                {
                  label: 'Kết nối',
                  icon: 'generate',
                  status: 'danger',
                  action: async (form: FormGroup) => {
                    const connectionString = form.get('ConnectionString').value;
                    return this.apiService.postPromise(this.apiPath, { connectByConnectionString: true }, [{ ConnectionString: connectionString }]).then(rs => {
                      this.refresh();
                      this.cms.toastService.show('Đã kết nối với core xxx', 'Kết nối core thành công', { status: 'success' });
                    }).catch(err => {
                      console.error(err);
                      return false;
                    }).then(rs => true);
                  },
                },
              ],
            },
          });
        },
      });

      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      columns: {
        Code: {
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '10%',
        },
        RefCore: {
          title: this.cms.translateText('RefCode'),
          type: 'string',
          width: '20%',
        },
        RefCoreName: {
          title: this.cms.translateText('RefCoreName'),
          type: 'string',
          width: '20%',
        },
        RefCoreNote: {
          title: this.cms.translateText('RefCoreNote'),
          type: 'string',
          width: '40%',
        },
        State: {
          title: this.cms.translateText('Common.state'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'checkmark-circle';
            instance.display = true;
            instance.status = 'success';
            instance.disabled = this.isChoosedMode;
            instance.title = this.cms.translateText('Common.state');
            instance.label = this.cms.translateText('Common.state');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.commerceServiceByCycle[value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {
              this.changeStateConfirm(instance.rowData).then(status => {
                if (status) this.refresh();
              });
            });
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                placeholder: this.cms.translateText('Common.state') + '...',
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
                      results: this.stateList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Permission: {
          title: this.cms.translateText('Common.permission'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'shield';
            instance.display = true;
            instance.status = 'danger';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {

              this.cms.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.cms.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                  // resrouce: rowData,
                  apiPath: this.apiPath,
                }
              });

              // this.getFormData([rowData.Code]).then(rs => {
              //   this.preview(rs);
              // });
            });
          },
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeParent'] = true;
      params['includeRelativeVouchers'] = true;
      params['sort_DateOfStart'] = 'asc';
      return params;
    };

    return source;
  }

  changeStateConfirm(data: PageModel) {
    const params = { id: [data.Code] };
    const processMap: ProcessMap = AppModule.processMaps.commerceServiceByCycle[data.State || ''];
    params['changeState'] = processMap?.nextState;

    return new Promise(resolve => {
      this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(processMap?.confirmText, { object: this.cms.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.cms.translateText('Common.goback'),
          status: 'primary',
          action: () => {
            resolve(false);
          },
        },
        {
          label: this.cms.translateText(processMap?.nextStateLabel),
          status: AppModule.processMaps.commerceServiceByCycle[processMap.nextState || ''].status,
          action: async () => {
            this.loading = true;
            return this.apiService.putPromise<PageModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
              this.loading = false;
              this.cms.toastService.show(this.cms.translateText(processMap?.responseText, { object: this.cms.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.cms.translateText(processMap?.responseTitle), {
                status: 'success',
              });
              resolve(true);
              return true;
            }).catch(err => {
              this.loading = false;
              resolve(false);
              return false;
            });
          },
        },
      ], () => {
        resolve(false);
      });
    });
  }

}
