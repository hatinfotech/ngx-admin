import { Component, OnInit } from '@angular/core';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableButtonComponent, SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { takeUntil } from 'rxjs/operators';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { AppModule } from '../../../../app.module';
import { SmartTableDateRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { CollaboratorEducationArticleFormComponent } from '../education-article-form/collaborator-education-article-form.component';
import { CollaboratorEducationArticlePrintComponent } from '../education-article-print/collaborator-education-article-print.component';
import { CollaboratorEducationArticleModel } from '../../../../models/collaborator.model';

@Component({
  selector: 'ngx-collaborator-education-article-list',
  templateUrl: './collaborator-education-article-list.component.html',
  styleUrls: ['./collaborator-education-article-list.component.scss'],
})
export class CollaboratorEducationArticleListComponent extends ServerDataManagerListComponent<CollaboratorEducationArticleModel> implements OnInit {

  componentName: string = 'CollaboratorEducationArticleListComponent';
  formPath = '/collaborator/education-article/form';
  apiPath = '/collaborator/education-articles';
  idKey = ['Code', 'Page'];

  formDialog = CollaboratorEducationArticleFormComponent;
  printDialog = CollaboratorEducationArticlePrintComponent;
  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorEducationArticleListComponent>;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorEducationArticleListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    return super.init();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: CollaboratorEducationArticleModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: CollaboratorEducationArticleModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error, complete);
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: this.isChoosedMode ? false : {
        position: 'right',
      },
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        No: {
          title: 'No.',
          type: 'string',
          width: '1%',
          filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Code: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '5%',
        },
        Title: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.title'), 'head-title'),
          type: 'string',
          width: '50%',
        },
        Creator: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.creator'), 'head-title'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: string, row?: any) => {
            return this.commonService.getObjectText(cell);
          },
        },
        DateOfCreated: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.dateOfCreated'), 'head-title'),
          type: 'custom',
          width: '15%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        Link: {
          title: 'Link',
          type: 'custom',
          width: '5%',
          exclude: this.isChoosedMode,
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'link-2-outline';
            // instance.label = this.commonService.translateText('Common.copy');
            instance.display = true;
            instance.status = 'primary';
            instance.init.pipe(takeUntil(this.destroy$)).subscribe((row: CollaboratorEducationArticleModel) => {
              const link = `https://probox.center/${(row.Page && row.Page.id || row.Page).toLowerCase()}/ctvbanhang/edu/${row?.Code?.toLowerCase()}`;
              instance.title = link;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe(async (row: CollaboratorEducationArticleModel) => {
              const link = `https://probox.center/${(row.Page && row.Page.id || row.Page).toLowerCase()}/ctvbanhang/edu/${row?.Code?.toLowerCase()}`;
              this.commonService.copyTextToClipboard(link);
            });
          },
        },
        Copy: {
          title: 'Copy',
          type: 'custom',
          width: '5%',
          exclude: this.isChoosedMode,
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'copy';
            // instance.label = this.commonService.translateText('Common.copy');
            instance.display = true;
            instance.status = 'warning';
            instance.valueChange.subscribe(value => {
              // if (value) {
              //   instance.disabled = false;
              // } else {
              //   instance.disabled = true;
              // }
            });
            instance.click.subscribe(async (row: CollaboratorEducationArticleModel) => {

              this.commonService.openDialog(CollaboratorEducationArticleFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [row.Code],
                  isDuplicate: true,
                  onDialogSave: (newData: CollaboratorEducationArticleModel[]) => {
                    // if (onDialogSave) onDialogSave(row);
                  },
                  onDialogClose: () => {
                    // if (onDialogClose) onDialogClose();
                    this.refresh();
                  },
                },
              });

            });
          },
        },
        State: {
          title: this.commonService.translateText('Common.state'),
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
            instance.title = this.commonService.translateText('Common.approved');
            instance.label = this.commonService.translateText('Common.approved');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.collaboratorEdutcationArticle[value || ''];
              instance.label = this.commonService.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorEducationArticleModel) => {
              // this.apiService.getPromise<CollaboratorEducationArticleModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
              this.preview([rowData]);
              // });
            });
          },
        },
        Permission: {
          title: this.commonService.translateText('Common.permission'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          exclude: this.isChoosedMode,
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'shield';
            instance.display = true;
            instance.status = 'danger';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.title = this.commonService.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorEducationArticleModel) => {

              this.commonService.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.commonService.translateText('Purchase.PurchaseVoucher  .title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
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
        Preview: {
          title: this.commonService.translateText('Common.show'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'external-link-outline';
            instance.display = true;
            instance.status = 'primary';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.title = this.commonService.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorEducationArticleModel) => {
              // this.getFormData([rowData.Code]).then(rs => {
              this.preview([rowData]);
              // });
            });
          },
        }
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: CollaboratorEducationArticleModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeObject'] = true;
      params['includeContact'] = true;
      params['includeCreator'] = true;
      params['includeRelativeVouchers'] = true;
      params['sort_Id'] = 'desc';
      // params['eq_Type'] = 'PAYMENT';
      return params;
    };

    return source;
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<CollaboratorEducationArticleModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
  }

  // preview(data: CollaboratorEducationArticleModel[], source?: string) {
  //   this.commonService.openDialog(PurchaseVoucherPrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       data: data,
  //       idKey: ['Code'],
  //       id: data.map(m => m[this.idKey]),
  //       sourceOfDialog: 'list',
  //       mode: 'print',
  //       // approvedConfirm: true,
  //       onChange: (data: CollaboratorEducationArticleModel) => {
  //         this.refresh();
  //       },
  //       onSaveAndClose: () => {
  //         this.refresh();
  //       },
  //     },
  //   });
  //   return false;
  // }

}
