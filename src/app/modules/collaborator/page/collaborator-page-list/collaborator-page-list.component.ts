import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableTagsComponent, SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { ChatRoomModel } from '../../../../models/chat-room.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { CollaboratorPageFormComponent } from '../collaborator-page-form/collaborator-page-form.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { PageModel } from '../../../../models/page.model';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';

@Component({
  selector: 'ngx-collaborator-page-list',
  templateUrl: './collaborator-page-list.component.html',
  styleUrls: ['./collaborator-page-list.component.scss']
})
export class CollaboratorPageListComponent extends AgGridDataManagerListComponent<PageModel, CollaboratorPageFormComponent> implements OnInit {

  componentName: string = 'CollaboratorPageListComponent';
  formPath = '/collaborator/page/form';
  apiPath = '/collaborator/pages';
  idKey = 'Code';
  formDialog = CollaboratorPageFormComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  // @Input() gridHeight: string;


  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorPageListComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    // this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  async init() {
    return super.init().then(async state => {


      // const processingMap = AppModule.processMaps['purchaseOrder'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
        },
        {
          headerName: 'Mã',
          field: 'Code',
          width: 200,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          headerName: 'Tên',
          field: 'Name',
          width: 300,
          filter: 'agTextColumnFilter',
          // autoHeight: true,
          // pinned: 'left',
        },
        {
          headerName: 'Mô tả',
          field: 'Description',
          width: 1024,
          filter: 'agTextColumnFilter',
          // autoHeight: true,
          // pinned: 'left',
        },
        {
          ...agMakeStateColDef(this.cms, AppModule.processMaps.collaboratorPage, (data) => {
            // this.preview([data]);
            // if (this.cms.getObjectId(data.State) == 'PROCESSING') {
            //   this.openForm([data.Code]);
            // } else {
            //   this.preview([data]);
            // }
            this.changeStateConfirm(data).then(status => {
              if (status) this.refresh();
            });
          }),
          headerName: 'Trạng thái',
          field: 'State',
          pinned: 'right',
          width: 155,
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, true, true, [
            {
              name: 'genrerateRegisterRefLink',
              label: '',
              title: 'Tạo link đăng ký CTV Bán hàng',
              icon: 'link-2-outline',
              status: 'primary',
              appendTo: 'head',
              outline: false,
              action: async (params, buttonConfigs) => {
                if (params?.node?.data?.Code) {
                  await this.apiService.putPromise(this.apiPath + '/' + params.node.data.Code, { genrerateRegisterRefLink: true }, [{ Code: params.node.data.Code }]).then(rs => {
                    console.log(rs);
                    this.cms.showDialog('Link đăng ký CTV Bán hàng', rs['data'], [
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
                          this.cms.copyTextToClipboard(rs['data']);
                        },
                      },
                    ]);
                  });
                }
                return true;
              }
            },
            {
              name: 'pushPageInfo',
              label: '',
              title: 'Đẩy thông tin trang lên app ProBox',
              icon: 'cloud-upload-outline',
              status: 'warning',
              appendTo: 'head',
              outline: false,
              action: async (params, buttonConfigs) => {
                if (params?.node?.data?.Code) {
                  this.cms.openDialog(ShowcaseDialogComponent, {
                    closeOnBackdropClick: false,
                    closeOnEsc: false,
                    context: {
                      title: this.cms.translateText('Common.subscribe'),
                      content: this.cms.translateText('Collaborator.Page.pushProductConfirmText'),
                      actions: [
                        {
                          label: this.cms.translateText('Common.close'),
                          icon: 'arrow-ios-back-outline',
                          status: 'primary',
                        },
                        {
                          label: this.cms.translateText('Collaborator.Page.pushProductLabel'),
                          status: 'danger',
                          icon: 'cloud-upload-outline',
                          action: async (item, dialog) => {
                            dialog.setLoading(true);
                            try {
                              await this.apiService.putPromise<PageModel[]>('/collaborator/pages', { id: [params.node.data.Code], push: true }, [{ Code: params.node.data.Code }]).then(rs => {
                                this.cms.toastService.show(this.cms.translateText('Common.success'), this.cms.translateText('Collaborator.Page.pushProductSuccessText'), {
                                  status: 'success',
                                });
                              });
                            } catch (err) {
                              dialog.setLoading(false);
                              this.cms.toastService.show('Lỗi đồng bộ', err?.logs?.join(', '), { status: 'dander' });
                            }
                            dialog.setLoading(false);
                            this.refresh();
                          }
                        },
                      ],
                    },
                  });
                }
                return true;
              }
            },
            // {
            //   name: 'generateConnectionString',
            //   label: '',
            //   title: 'Tạo chuỗi kết nối',
            //   icon: 'cloud-upload-outline',
            //   status: 'danger',
            //   appendTo: 'head',
            //   outline: false,
            //   action: async (params, buttonConfigs) => {
            //     this.apiService.postPromise(this.apiPath, { generateConnectionString: true }, []).then(rs => {
            //       this.cms.showDialog('Chuỗi kết nối core', rs['data'], [
            //         {
            //           label: 'Đóng',
            //           status: 'basic',
            //           action: () => {

            //           },
            //         },
            //         {
            //           label: 'Copy',
            //           status: 'success',
            //           action: () => {

            //           },
            //         },
            //       ])
            //     });
            //     return true;
            //   }
            // },
          ]),
        }
      ] as ColDef[]);

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // @Input() getRowHeight = (params: RowHeightParams<CommercePosOrderModel>) => {
  //   return 123;
  // }

  @Input() prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: PageModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(CollaboratorPageFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: PageModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
    return false;
  }

  onGridReady(params) {
    super.onGridReady(params);
  }



  changeStateConfirm(data: PageModel) {
    const params = { id: [data.Code] };
    const processMap: ProcessMap = AppModule.processMaps.collaboratorPage[data.State || ''];
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
