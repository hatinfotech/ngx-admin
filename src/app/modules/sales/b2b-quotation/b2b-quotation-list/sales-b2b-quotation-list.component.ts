// import { SalesModule } from './../../sales.module';
import { Component, Input, OnInit } from '@angular/core';
import { SalesB2bQuotationModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { SalesB2bQuotationFormComponent } from '../b2b-quotation-form/sales-b2b-quotation-form.component';
import { SalesB2bQuotationPrintComponent } from '../b2b-quotation-print/sales-b2b-quotation-print.component';
import { AppModule } from '../../../../app.module';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { PriceReportModel } from '../../../../models/price-report.model';

@Component({
  selector: 'ngx-b2b-quotation-list',
  templateUrl: './sales-b2b-quotation-list.component.html',
  styleUrls: ['./sales-b2b-quotation-list.component.scss'],
})
export class SalesB2bQuotationListComponent extends AgGridDataManagerListComponent<SalesB2bQuotationModel, SalesB2bQuotationFormComponent> implements OnInit {

  componentName: string = 'SalesB2bQuotationListComponent';
  formPath = '/sales/price-report/form';
  apiPath = '/sales/price-quotations';
  idKey = ['Code'];

  printDialog = SalesB2bQuotationPrintComponent;
  formDialog = SalesB2bQuotationFormComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = '100%';


  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<SalesB2bQuotationListComponent>,
    public datePipe: DatePipe,
    public mobileAppService: MobileAppService
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

      const processingMap = AppModule.processMaps['priceReport'];
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
          width: 150,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          headerName: 'Khách hàng',
          field: 'Object',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Tiêu đề',
          field: 'Title',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Ngày báo giá',
          field: 'Reported',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeTagsColDef(this.cms, (tag) => {
            this.cms.previewVoucher(tag.type, tag.id);
          }),
          pinned: 'right',
          headerName: 'Chứng từ liên quan',
          field: 'RelativeVouchers',
          width: 240,
        },
        {
          headerName: 'Người tạo',
          field: 'Creator',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn người tạo...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Ngày tạo',
          field: 'Created',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Số tiền',
          field: 'Amount',
          pinned: 'right',
          width: 150,
        },
        {
          ...agMakeStateColDef(this.cms, processingMap, (data) => {
            this.preview([data]);
          }),
          headerName: 'Trạng thái',
          field: 'State',
          width: 155,
        },
        // {
        //   ...agMakeButtonsColDef(this.cms, [
        //     {
        //       name: 'createTask',
        //       // label: 'Tạo vị trí',
        //       status: 'success',
        //       outline: false,
        //       icon: 'message-circle-outline',
        //       action: async (params: any, data: SalesB2bQuotationModel) => {
        //         let task = params.node.data.RelativeVouchers?.find(f => f.type == 'CHATROOM');
        //         if (task) {
        //           this.cms.openMobileSidebar();
        //           this.mobileAppService.openChatRoom({ ChatRoom: task.id });
        //         } else {
        //           this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + this.makeId(params.node.data), { includeRelatedTasks: true }).then(rs => {
        //             const priceReport = rs[0];
        //             if (priceReport && priceReport['Tasks'] && priceReport['Tasks'].length > 0) {

        //               task = params.node.data.RelativeVouchers?.find(f => f.type == 'CHATROOM');
        //               if (task) {
        //                 this.cms.openMobileSidebar();
        //                 this.mobileAppService.openChatRoom({ ChatRoom: task.id });
        //               }
        //             }
        //             if (!task) {
        //               this.cms.showDialog(this.cms.translateText('Common.warning'), this.cms.translateText('Chưa có task cho phiếu triển khai này, bạn có muốn tạo ngây bây giờ không ?'), [
        //                 {
        //                   label: this.cms.translateText('Common.goback'),
        //                   status: 'danger',
        //                   icon: 'arrow-ios-back',
        //                 },
        //                 {
        //                   label: this.cms.translateText('Common.create'),
        //                   status: 'success',
        //                   icon: 'message-circle-outline',
        //                   action: () => {
        //                     this.apiService.putPromise<PriceReportModel[]>('/sales/price-reports', { createTask: true }, [{ Code: params.node.data?.Code }]).then(rs => {
        //                       if (rs && rs[0] && rs[0]['Tasks'] && rs[0]['Tasks'].length > 0)
        //                         this.cms.toastService.show(this.cms.translateText('đã tạo task cho báo giá'),
        //                           this.cms.translateText('Common.notification'), {
        //                           status: 'success',
        //                         });
        //                       this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + this.makeId(params.node.data), { includeRelativeVouchers: true }).then(rs => {
        //                         this.updateGridItems([params.node.data], rs);
        //                       });
        //                       setTimeout(() => {
        //                         this.cms.openMobileSidebar();
        //                         this.mobileAppService.openChatRoom({ ChatRoom: rs[0]['Tasks'][0]?.Task });
        //                       }, 500);
        //                     });
        //                   }
        //                 },
        //               ]);
        //             }
        //           }).catch(err => {
        //             return Promise.reject(err);
        //           });
        //         }
        //         return true;
        //       }
        //     },
        //   ]),
        //   headerName: 'Task',
        //   field: 'Task',
        //   width: 70,
        // },
        {
          ...agMakeCommandColDef(this, this.cms, true, true, true, [
            {
              name: 'createTask',
              icon: 'message-circle-outline',
              outline:  false,
              status: 'success',
              appendTo: 'head',
              action: async (params: any) => {
                let task = params.node.data.RelativeVouchers?.find(f => f.type == 'CHATROOM');
                if (task) {
                  this.cms.openMobileSidebar();
                  this.mobileAppService.openChatRoom({ ChatRoom: task.id });
                } else {
                  this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + this.makeId(params.node.data), { includeRelatedTasks: true }).then(rs => {
                    const priceReport = rs[0];
                    if (priceReport && priceReport['Tasks'] && priceReport['Tasks'].length > 0) {

                      task = params.node.data.RelativeVouchers?.find(f => f.type == 'CHATROOM');
                      if (task) {
                        this.cms.openMobileSidebar();
                        this.mobileAppService.openChatRoom({ ChatRoom: task.id });
                      }
                    }
                    if (!task) {
                      this.cms.showDialog(this.cms.translateText('Common.warning'), this.cms.translateText('Chưa có task cho phiếu triển khai này, bạn có muốn tạo ngây bây giờ không ?'), [
                        {
                          label: this.cms.translateText('Common.goback'),
                          status: 'danger',
                          icon: 'arrow-ios-back',
                        },
                        {
                          label: this.cms.translateText('Common.create'),
                          status: 'success',
                          icon: 'message-circle-outline',
                          action: () => {
                            this.apiService.putPromise<PriceReportModel[]>('/sales/price-reports', { createTask: true }, [{ Code: params.node.data?.Code }]).then(rs => {
                              if (rs && rs[0] && rs[0]['Tasks'] && rs[0]['Tasks'].length > 0)
                                this.cms.toastService.show(this.cms.translateText('đã tạo task cho báo giá'),
                                  this.cms.translateText('Common.notification'), {
                                  status: 'success',
                                });
                              this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + this.makeId(params.node.data), { includeRelativeVouchers: true }).then(rs => {
                                this.updateGridItems([params.node.data], rs);
                              });
                              setTimeout(() => {
                                this.cms.openMobileSidebar();
                                this.mobileAppService.openChatRoom({ ChatRoom: rs[0]['Tasks'][0]?.Task });
                              }, 500);
                            });
                          }
                        },
                      ]);
                    }
                  }).catch(err => {
                    return Promise.reject(err);
                  });
                }
                return true;
              }
            }
          ]),
          headerName: 'Lệnh',
        },
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

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeObject'] = true;
    params['includeContact'] = true;
    params['includeCreator'] = true;
    params['includeRelativeVouchers'] = true;
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: SalesB2bQuotationModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(SalesB2bQuotationFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: SalesB2bQuotationModel[]) => {
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
}
