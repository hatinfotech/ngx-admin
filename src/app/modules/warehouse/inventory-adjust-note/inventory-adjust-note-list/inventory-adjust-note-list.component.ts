import { Component, OnInit } from '@angular/core';
import { WarehouseInventoryAdjustNoteModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableButtonComponent, SmartTableDateTimeComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { WarehouseInventoryAdjustNoteFormComponent } from '../inventory-adjust-note-form/inventory-adjust-note-form.component';
import { takeUntil } from 'rxjs/operators';
import { WarehouseInventoryAdjustNotePrintComponent } from '../inventory-adjust-note-print/inventory-adjust-note-print.component';
import { AppModule } from '../../../../app.module';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';

@Component({
  selector: 'ngx-inventory-adjust-note-list',
  templateUrl: './inventory-adjust-note-list.component.html',
  styleUrls: ['./inventory-adjust-note-list.component.scss'],
})
export class WarehouseInventoryAdjustNoteListComponent extends ServerDataManagerListComponent<WarehouseInventoryAdjustNoteModel> implements OnInit {

  componentName: string = 'WarehouseInventoryAdjustNoteListComponent';
  formPath = '/warehouse/inventory-adjust-notes/form';
  apiPath = '/warehouse/inventory-adjust-notes';
  idKey = 'Code';

  formDialog = WarehouseInventoryAdjustNoteFormComponent;
  printDialog = WarehouseInventoryAdjustNotePrintComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<WarehouseInventoryAdjustNoteListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);

    if (this.ref && Object.keys(this.ref).length > 0) {
      for (const actionButton of this.actionButtonList) {
        if (['add', 'delete', 'edit'].indexOf(actionButton.name) > -1) {
          actionButton.hidden = () => true;
        }
      }
    }
  }

  async init() {
    return super.init();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: WarehouseInventoryAdjustNoteModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: WarehouseInventoryAdjustNoteModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error, complete);
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: this.ref && Object.keys(this.ref).length > 0 ? false : {
        position: 'right',
      },
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        Code: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '5%',
        },
        ObjectName: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.object'), 'head-title'),
          type: 'string',
          width: '15%',
        },
        Title: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.title'), 'head-title'),
          type: 'string',
          width: '30%',
        },
        DateOfCreated: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.dateOfCreated'), 'head-title'),
          type: 'custom',
          width: '8%',
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        DateOfDelivered: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.dateOfDelivered'), 'head-title'),
          type: 'custom',
          width: '8%',
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        Creator: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.creator'), 'head-title'),
          type: 'string',
          width: '10%',
          // filter: {
          //   type: 'custom',
          //   component: SmartTableDateTimeRangeFilterComponent,
          // },
          valuePrepareFunction: (cell: string, row?: any) => {
            return this.commonService.getObjectText(cell);
          },
        },
        RelativeVouchers: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableTagsComponent,
          onComponentInitFunction: (instance: SmartTableTagsComponent) => {
            instance.click.subscribe((tag: { id: string, text: string, type: string }) => this.commonService.previewVoucher(tag.type, tag.id));
          },
          width: '15%',
        },
        Copy: {
          title: 'Copy',
          type: 'custom',
          width: '5%',
          exclude: this.ref && Object.keys(this.ref).length > 0,
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
            instance.click.subscribe(async (row: WarehouseInventoryAdjustNoteModel) => {

              this.commonService.openDialog(WarehouseInventoryAdjustNoteFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [row.Code],
                  isDuplicate: true,
                  onDialogSave: (newData: WarehouseInventoryAdjustNoteModel[]) => {
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
            instance.disabled = this.ref && Object.keys(this.ref).length > 0;
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.title = this.commonService.translateText('Common.approved');
            instance.label = this.commonService.translateText('Common.approved');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.warehouseReceiptGoodsNote[value || ''];
              instance.label = this.commonService.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
              // instance.disabled = (value === 'APPROVE');
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WarehouseInventoryAdjustNoteModel) => {
              // this.apiService.getPromise<WarehouseInventoryAdjustNoteModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
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
          exclude: this.ref && Object.keys(this.ref).length > 0,
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
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WarehouseInventoryAdjustNoteModel) => {

              this.commonService.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.commonService.translateText('Purchase.Order.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
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
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WarehouseInventoryAdjustNoteModel) => {
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

  getList(callback: (list: WarehouseInventoryAdjustNoteModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCreator'] = true;
      params['includeRelativeVouchers'] = true;
      params['sort_Id'] = 'desc';
      // params['eq_Type'] = 'PAYMENT';
      return params;
    };

    return source;
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<WarehouseInventoryAdjustNoteModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
  }

  // preview(data: WarehouseInventoryAdjustNoteModel[]) {
  //   this.commonService.openDialog(WarehouseInventoryAdjustNotePrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       data: data,
  //       idKey: ['Code'],
  //       sourceOfDialog: 'list',
  //       // approvedConfirm: true,
  //       onClose: (data: WarehouseInventoryAdjustNoteModel) => {
  //         this.refresh();
  //       },
  //     },
  //   });
  //   return false;
  // }

}
