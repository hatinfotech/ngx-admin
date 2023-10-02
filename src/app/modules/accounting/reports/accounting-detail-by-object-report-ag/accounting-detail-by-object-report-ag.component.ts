import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { SmartTableButtonComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../../acc-account/acc-account-form/acc-account-form.component';
import { AccountingService } from '../../accounting.service';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { agMakeAccCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/acc-currency.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AccountingAccountDetailsReportPrintComponent } from '../print/accounting-account-details-report-print/accounting-account-details-report-print.component';
import { AccountingReceivablesFromCustomersDetailsReportPrintComponent } from '../print/accounting-receivables-from-customers-details-report-print/accounting-receivables-from-customers-details-report-print.component';
import { AccountingReceivablesFromCustomersVoucherssReportPrintComponent } from '../print/accounting-receivables-from-customers-vouchers-report-print/accounting-receivables-from-customers-vouchers-report-print.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-accounting-detail-by-object-report-ag',
  templateUrl: './accounting-detail-by-object-report-ag.component.html',
  styleUrls: ['./accounting-detail-by-object-report-ag.component.scss']
})
export class AccountingDetailByObjectReportAgComponent extends AgGridDataManagerListComponent<AccountModel, any> implements OnInit {

  componentName: string = 'AccountingDetailByObjectReportAgComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/reports';
  idKey = ['Voucher', 'WriteNo'];
  formDialog = AccAccountFormComponent;

  reuseDialog = false;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  protected pagingConf = { display: true, page: 1, perPage: 40 };

  totalBalance: { Debit: number, Credit: number } = null;
  tabs: any[];

  @Input() title?: string;
  @Input() object?: string;
  @Input() accounts?: string[];
  @Input() fromDate?: Date;
  @Input() toDate?: Date;
  @Input() filter?: any;
  @Input() report?: string;
  @Input() groupBy?: string;
  @Input() includeRowHeader?: boolean;
  @Input() includeIncrementAmount?: boolean;
  @Input() balance?: 'debt' | 'credit' | 'both';
  @Input() reportComponent: Type<any> | TemplateRef<any>;
  @Input() rowMultiSelectWithClick: boolean;
  // @Input() suppressRowClickSelection = true;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccountingDetailByObjectReportAgComponent>,
    public accountingService: AccountingService,
    public prds: AdminProductService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);
  }

  onGridReady(params: any): void {
    super.onGridReady(params);
    // setTimeout(() => {
    //   this.gridApi.ensureIndexVisible(this.infiniteInitialRowCount, 'bottom');
    // }, 5000);
  }

  async init() {
    // await this.loadCache();
    await this.cms.waitForReady();
    this.tabs = [
      {
        title: 'Liabilities',
        route: '/accounting/report/liabilities',
        icon: 'home',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: 'Receivables',
        route: '/accounting/report/receivables',
      },
      {
        title: 'Users',
        icon: 'person',
        route: './tab1',
      },
      {
        title: 'Orders',
        icon: 'paper-plane-outline',
        responsive: true,
        route: ['./tab2'],
      },
      {
        title: 'Transaction',
        icon: 'flash-outline',
        responsive: true,
        disabled: true,
      },
    ];
    return super.init().then(async rs => {
      // this.actionButtonList = this.actionButtonList.filter(f => f.name !== 'choose');
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'add', 'choose'].indexOf(f.name) < 0);

      // if (this.reportComponent) {
      //   const summaryReportBtn = this.actionButtonList.find(f => f.name == 'preview');
      //   summaryReportBtn.label = summaryReportBtn.title = 'In báo cáo chứng từ';
      //   summaryReportBtn.icon = 'printer';
      //   summaryReportBtn.status = 'info';
      //   summaryReportBtn.disabled = () => false;
      //   summaryReportBtn.click = () => {
      //     let query = {};
      //     const filterModel = this.gridApi.getFilterModel();
      //     const filterQuery = this.parseFilterToApiParams(filterModel);
      //     query = this.prepareApiParams(filterQuery);
      //     this.cms.openDialog(AccountingReceivablesFromCustomersVoucherssReportPrintComponent, {
      //       context: {
      //         showLoadinng: true,
      //         // title: 'Xem trước',
      //         // accounts: this.accounts,
      //         objects: [this.object],
      //         mode: 'print',
      //         id: ['all'],
      //         query: query,
      //       },
      //     });
      //   };
      // } else {
      this.actionButtonList = this.actionButtonList.filter(f => ['preview'].indexOf(f.name) < 0);
      // }

      this.actionButtonList.unshift({
        type: 'button',
        name: 'printReportByVoucher',
        status: 'primary',
        label: 'In báo cáo chứng từ',
        title: 'In báo cáo',
        size: 'medium',
        icon: 'printer',
        // disabled: () => {
        //   return this.selectedIds.length == 0;
        // },
        click: () => {
          const filterModel = this.gridApi.getFilterModel();
          let query = {};
          const filterQuery = this.parseFilterToApiParams(filterModel);
          query = this.prepareApiParams(filterQuery);
          this.cms.openDialog(AccountingReceivablesFromCustomersVoucherssReportPrintComponent, {
            context: {
              showLoadinng: true,
              // title: 'Xem trước',
              // accounts: this.accounts,
              mode: 'print',
              id: ['all'],
              query: query,
              objects: [this.object || null],
            },
          });
        }
      });
      this.actionButtonList.unshift({
        type: 'button',
        name: 'printReportByDetail',
        status: 'primary',
        label: 'In báo cáo Chi tiết',
        title: 'In báo cáo',
        size: 'medium',
        icon: 'printer',
        // disabled: () => {
        //   return this.selectedIds.length == 0;
        // },
        click: () => {
          const filterModel = this.gridApi.getFilterModel();
          let query = {};
          const filterQuery = this.parseFilterToApiParams(filterModel);
          query = this.prepareApiParams(filterQuery);
          this.cms.openDialog(AccountingReceivablesFromCustomersDetailsReportPrintComponent, {
            context: {
              showLoadinng: true,
              // title: 'Xem trước',
              // accounts: this.accounts,
              mode: 'print',
              id: ['all'],
              query: query,
              objects: [this.object || null],
            },
          });
        }
      });

      // Auto refresh list on reportToDate changed
      // this.accountingService?.reportToDate$.pipe(takeUntil(this.destroy$), filter(f => f !== null)).subscribe(toDate => {
      //   console.log(toDate);
      //   this.refresh();
      // });

      await this.cms.waitForLanguageLoaded();
      await this.prds.unitList$.pipe(takeUntil(this.destroy$), filter(f => !!f), take(1)).toPromise();
      let columnDefs = [
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: '#',
          field: 'Id',
          width: 120,
          // valueGetter: 'node.data.Id',
          valueGetter: (params) => {
            return params.data?.Voucher && (params.data?.Voucher + '-' + params.data?.WriteNo) || null;
          }
        },
        {
          headerName: ' Ngày chứng từ',
          field: 'VoucherDate',
          width: 170,
          // pinned: 'left',
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: this.cms.translateText('Common.contact'),
          field: 'Object',
          // pinned: 'left',
          width: 200,
          // cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          valueFormatter: (params) => {
            return params.data?.ObjectName;
          },
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
          ...agMakeTagsColDef(this.cms, (tag) => {
            this.cms.previewVoucher(tag.type, tag.id);
          }),
          headerName: 'Chứng từ',
          field: 'Voucher',
          width: 180,
          // pinned: 'right',
          cellClass: ['ag-cell-items-center'],
          valueGetter: (params) => {
            return (params.data?.Voucher ? [params.data?.Voucher] : []).map(m => ({
              id: m,
              text: m
            }));
          }
        },
        {
          headerName: 'Diễn giải',
          field: 'Description',
          width: 250,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Sản phẩm',
          field: 'Product',
          // pinned: 'left',
          width: 200,
          cellRenderer: (params) => {
            return params.data?.Description;
          },
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/products', { includeIdText: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn sản phẩm...', limit: 10, prepareReaultItem: (item) => {
                  // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
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
          headerName: 'Khoản mục CP',
          field: 'CostClassification',
          width: 180,
          filter: 'agTextColumnFilter',
          filterParams: {
            type: 'equals'
          },
          autoHeight: true,
          cellRenderer: AgTextCellRenderer,
        },
        {
          headerName: 'Luồng hạch toán',
          field: 'Thread',
          width: 180,
          filter: 'agTextColumnFilter',
          filterParams: {
            type: 'equals'
          },
          autoHeight: true,
          cellRenderer: AgTextCellRenderer,
        },
        {
          headerName: 'TK',
          field: 'Account',
          width: 100,
          filter: 'agTextColumnFilter',
          pinned: 'right',
        },
        {
          headerName: 'ĐU',
          field: 'ContraAccount',
          width: 100,
          filter: 'agTextColumnFilter',
          pinned: 'right',
        },
        {
          headerName: 'SL',
          field: 'Quantity',
          width: 80,
          filter: 'agNumberColumnFilter',
          pinned: 'right',
        },
        {
          headerName: 'ĐVT',
          field: 'ProductUnit',
          width: 100,
          // filter: 'agTextColumnFilter',
          valueFormatter: (params) => {
            return params.data?.ProductUnitLabel;
          },
          pinned: 'right',
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              placeholder: 'Chọn...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              withThumbnail: false,
              multiple: true,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              data: this.prds.unitList$.value,
            }
          },
        },
        {
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: 'Giá',
          field: 'Price',
          pinned: 'right',
          width: 100,
        },
        {
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: 'Đ.Kỳ',
          field: 'HeadAmount',
          pinned: 'right',
          width: 100,
        },
        {
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: 'PS.Nợ',
          field: 'GenerateDebit',
          pinned: 'right',
          width: 100,
        },
        {
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: 'PS.Có',
          field: 'GenerateCredit',
          pinned: 'right',
          width: 100,
        },
      ] as ColDef[];

      if (this.balance == 'debt') {
        columnDefs.push({
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: this.cms.translateText('Accounting.increment'),
          field: 'IncrementAmount',
          pinned: 'right',
          width: 150,
        });
      } else if (this.balance == 'credit') {
        columnDefs.push({
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: this.cms.translateText('Accounting.increment'),
          field: 'IncrementAmount',
          pinned: 'right',
          width: 150,
        });
      } else if (this.balance == 'both') {
        columnDefs.push({
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: this.cms.translateText('Accounting.tailDebit'),
          field: 'DebitIncrementAmount',
          pinned: 'right',
          width: 150,
          valueGetter: (params) => {
            if (params.data?.IncrementAmount >= 0) {
              return params.data.IncrementAmount;
            }
            return null;
          }
        });
        columnDefs.push({
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: this.cms.translateText('Accounting.tailDebit'),
          field: 'DebitIncrementAmount',
          pinned: 'right',
          width: 150,
          valueGetter: (params) => {
            if (params.data?.IncrementAmount >= 0) {
              return parseFloat(-params.data.IncrementAmount as any).toString();
            }
            return null;
          }
        });
      } else {
        columnDefs.push({
          ...agMakeAccCurrencyColDef(this.cms),
          headerName: this.cms.translateText('Accounting.increment'),
          field: 'IncrementAmount',
          pinned: 'right',
          width: 150,
        });
      }

      this.columnDefs = this.configSetting(columnDefs);

      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    // let settings: SmartTableSetting = {
    //   actions: false,
    //   columns: {
    //     VoucherDate: {
    //       title: this.cms.translateText('Accounting.voucherDate'),
    //       type: 'datetime',
    //       width: '10%',
    //     },
    //     Object: {
    //       title: this.cms.translateText('Common.contact'),
    //       type: 'string',
    //       width: '13%',
    //       valuePrepareFunction: (cell: any, row: any) => {
    //         return row.ObjectName;
    //       },
    //       filter: {
    //         type: 'custom',
    //         component: SmartTableSelect2FilterComponent,
    //         config: {
    //           delay: 0,
    //           condition: 'eq',
    //           select2Option: {
    //             ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true }, {
    //               placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
    //                 item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
    //                 return item;
    //               }
    //             }),
    //             multiple: true,
    //             logic: 'OR',
    //             allowClear: true,
    //           },
    //         },
    //       },
    //     },
    //     Product: {
    //       title: this.cms.translateText('Sản phẩm'),
    //       type: 'string',
    //       width: '13%',
    //       valuePrepareFunction: (cell: any, row: any) => {
    //         return row.Description;
    //       },
    //       filter: {
    //         type: 'custom',
    //         component: SmartTableSelect2FilterComponent,
    //         config: {
    //           delay: 0,
    //           condition: 'eq',
    //           select2Option: {
    //             ...this.cms.makeSelect2AjaxOption('/admin-product/products', { includeIdText: true }, {
    //               placeholder: 'Chọn sản phẩm...', limit: 10, prepareReaultItem: (item) => {
    //                 // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
    //                 return item;
    //               }
    //             }),
    //             multiple: true,
    //             logic: 'OR',
    //             allowClear: true,
    //           },
    //         },
    //       },
    //     },
    //     Description: {
    //       title: this.cms.translateText('Common.description'),
    //       type: 'string',
    //       width: '12%',
    //     },
    //     Voucher: {
    //       title: this.cms.translateText('Common.voucher'),
    //       type: 'custom',
    //       renderComponent: SmartTableTagsComponent,
    //       valuePrepareFunction: (cell: string, row: any) => {
    //         return [{ id: cell, text: row['Description'], type: row['VoucherType'] }] as any;
    //       },
    //       onComponentInitFunction: (instance: SmartTableTagsComponent) => {
    //         instance.click.subscribe((tag: { id: string, text: string, type: string }) => tag.type && this.cms.previewVoucher(tag.type, tag.id, null, (data, printComponent) => {
    //           // this.refresh();
    //         }));
    //       },
    //       width: '10%',
    //     },
    //     Account: {
    //       title: this.cms.translateText('Accounting.account'),
    //       type: 'string',
    //       width: '5%',
    //     },
    //     ContraAccount: {
    //       title: this.cms.translateText('Đối ứng'),
    //       type: 'string',
    //       width: '5%',
    //     },
    //     Quantity: {
    //       title: this.cms.translateText('Số lượng'),
    //       type: 'number',
    //       width: '5%',
    //       valuePrepareFunction: (cell, row) => {
    //         return row.ProductUnitLabel ? row.Quantity : '-';
    //       },
    //     },
    //     Unit: {
    //       title: this.cms.translateText('ĐVT'),
    //       type: 'text',
    //       width: '5%',
    //       valuePrepareFunction: (cell, row) => {
    //         return row.ProductUnitLabel ? row.ProductUnitLabel : '-';
    //       },
    //     },
    //     Price: {
    //       title: this.cms.translateText('Giá'),
    //       type: 'acc-currency',
    //       width: '5%',
    //       valuePrepareFunction: (cell, row) => {

    //         return row.Quantity ? `${(row.GenerateDebit - row.GenerateCredit) / row.Quantity}` : '-';
    //       },
    //     },
    //     HeadAmount: {
    //       title: this.cms.translateText('Accounting.headAmount'),
    //       type: 'acc-currency',
    //       width: '10%',
    //     },
    //     GenerateDebit: {
    //       title: this.cms.translateText('Accounting.debitGenerate'),
    //       type: 'acc-currency',
    //       width: '10%',
    //     },
    //     GenerateCredit: {
    //       title: this.cms.translateText('Accounting.creditGenerate'),
    //       type: 'acc-currency',
    //       width: '10%',
    //     },
    //   },
    // };
    // if (this.balance == 'debt') {
    //   settings.columns['IncrementAmount'] = {
    //     title: this.cms.translateText('Accounting.increment'),
    //     type: 'acc-currency',
    //     width: '10%',
    //   };
    // } else if (this.balance == 'credit') {
    //   settings.columns['IncrementAmount'] = {
    //     title: this.cms.translateText('Accounting.increment'),
    //     type: 'acc-currency',
    //     width: '10%',
    //   };
    // } else if (this.balance == 'both') {
    //   settings.columns['DebitIncrementAmount'] = {
    //     title: this.cms.translateText('Accounting.tailDebit'),
    //     type: 'acc-currency',
    //     width: '10%',
    //     valuePrepareFunction: (cel: string, row: any) => {
    //       if (row.IncrementAmount >= 0) {
    //         return row.IncrementAmount;
    //       }
    //       return '';
    //     }
    //   };
    //   settings.columns['CreditIncrementAmount'] = {
    //     title: this.cms.translateText('Accounting.tailCredit'),
    //     type: 'acc-currency',
    //     width: '10%',
    //     valuePrepareFunction: (cel: string, row: any) => {
    //       if (row.IncrementAmount < 0) {
    //         return parseFloat(-row.IncrementAmount as any).toString();
    //       }
    //       return '';
    //     }
    //   };
    // } else {
    //   settings.columns['IncrementAmount'] = {
    //     title: this.cms.translateText('Accounting.increment'),
    //     type: 'acc-currency',
    //     width: '10%',
    //     // valuePrepareFunction: (cell, row) => {
    //     //   return cell;
    //     // }
    //   };
    // }
    // settings.columns['Preview'] = {
    //   title: this.cms.translateText('Common.detail'),
    //   type: 'custom',
    //   width: '10%',
    //   class: 'align-right',
    //   renderComponent: SmartTableButtonComponent,
    //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
    //     instance.iconPack = 'eva';
    //     instance.icon = 'external-link-outline';
    //     instance.display = true;
    //     instance.status = 'primary';
    //     instance.style = 'text-align: right';
    //     instance.class = 'align-right';
    //     instance.title = this.cms.translateText('Common.preview');
    //     // instance.label = this.cms.translateText('Common.detail');
    //     instance.valueChange.subscribe(value => {
    //       // instance.icon = value ? 'unlock' : 'lock';
    //       // instance.status = value === 'REQUEST' ? 'warning' : 'success';
    //       // instance.disabled = value !== 'REQUEST';
    //     });
    //     instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: any) => {
    //       // this.getFormData([rowData.Code]).then(rs => {
    //       //   this.preview(rs);
    //       // });
    //       this.cms.previewVoucher(rowData['VoucherType'], rowData['Voucher']);
    //     });
    //   },
    // }
    // settings.pager = this.pagingConf;
    // settings = this.configSetting(settings);
    // delete settings.columns['Choose'];
    // return settings;
    return null;
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  prepareApiParams(params: any, getRowParams?: IGetRowsParams) {
    if (this.object) {
      params['eq_Object'] = this.object;
    }
    if (this.accounts) {
      params['eq_Accounts'] = this.accounts.join(',');
    }
    if (this.balance) {
      params['balance'] = this.balance;
    }
    if (this.report) {
      params[this.report] = true;
    } else {
      // params['reportDetailByObject'] = true;
    }
    if (typeof this.groupBy != 'undefined') {
      if (this.groupBy !== '') {
        params['groupBy'] = this.groupBy;
      }
    } else {
      params['groupBy'] = 'Voucher,WriteNo';
    }
    // params['groupBy'] = typeof this.groupBy != 'undefined' ? this.groupBy : 'Voucher,WriteNo';
    if (typeof this.includeRowHeader != 'undefined') {
      params['includeRowHeader'] = this.includeRowHeader;
    } else {
      params['includeRowHeader'] = true;
    }
    // params['includeRowHeader'] = true;
    if (typeof this.includeIncrementAmount != 'undefined') {
      params['includeIncrementAmount'] = this.includeIncrementAmount;
    } else {
      params['includeIncrementAmount'] = true;
    }

    let toDate = null;
    let fromDate = null;

    if (this.fromDate) {
      fromDate = this.fromDate
    } else {
      const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
      fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 0);
    }

    if (this.toDate) {
      toDate = this.toDate
    } else {
      const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
      toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59, 999);
    }

    params['toDate'] = toDate.toISOString();
    params['fromDate'] = fromDate.toISOString();
    if (this.filter) {
      params = { ...params, ...this.filter };
    }
    return params;
  }

  // initDataSource() {
  //   const source = super.initDataSource();

  //   // Set DataSource: prepareParams
  //   source.prepareParams = (params: any) => {

  //     if (this.object) {
  //       params['eq_Object'] = this.object;
  //     }
  //     if (this.accounts) {
  //       params['eq_Accounts'] = this.accounts.join(',');
  //     }
  //     if (this.balance) {
  //       params['balance'] = this.balance;
  //     }
  //     if (this.report) {
  //       params[this.report] = true;
  //     } else {
  //       // params['reportDetailByObject'] = true;
  //     }
  //     if (typeof this.groupBy != 'undefined') {
  //       if (this.groupBy !== '') {
  //         params['groupBy'] = this.groupBy;
  //       }
  //     } else {
  //       params['groupBy'] = 'Voucher,WriteNo';
  //     }
  //     // params['groupBy'] = typeof this.groupBy != 'undefined' ? this.groupBy : 'Voucher,WriteNo';
  //     if (typeof this.includeRowHeader != 'undefined') {
  //       params['includeRowHeader'] = this.includeRowHeader;
  //     } else {
  //       params['includeRowHeader'] = true;
  //     }
  //     // params['includeRowHeader'] = true;
  //     if (typeof this.includeIncrementAmount != 'undefined') {
  //       params['includeIncrementAmount'] = this.includeIncrementAmount;
  //     } else {
  //       params['includeIncrementAmount'] = true;
  //     }

  //     // if (this.accountingService?.reportToDate$?.value) {
  //     const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
  //     const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 0);

  //     const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
  //     const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59, 999);

  //     params['toDate'] = toDate.toISOString();
  //     params['fromDate'] = fromDate.toISOString();
  //     if (this.filter) {
  //       params = { ...params, ...this.filter };
  //     }
  //     // }

  //     return params;
  //   };

  //   return source;
  // }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: AccountModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: AccountModel[] | HttpErrorResponse) => void) {
  //   if (this.object) {
  //     params['eq_Object'] = this.object;
  //   }
  //   if (this.accounts) {
  //     params['eq_Account'] = this.accounts.join(',');
  //   }
  //   if (this.report) {
  //     params[this.report] = true;
  //   } else {
  //     params['reportDetailByObject'] = true;
  //   }
  //   super.executeGet(params, success, error, complete);
  // }

  // getList(callback: (list: AccountModel[]) => void) {
  //   super.getList((rs) => {
  //     let increment = 0;
  //     for (const item of rs) {
  //       // if (['131', '141', '1111','1121'].indexOf(item['Account']) > -1) {
  //       if (/^[1|2|6|8]/.test(item['Account'])) {
  //         item['HeadAmount'] = item['HeadDebit'] - item['HeadCredit'];
  //         item['IncrementAmount'] = (increment += item['HeadAmount'] + (item['GenerateDebit'] - item['GenerateCredit']));
  //       }
  //       // if (['331', '5111', '5112,5113', '5118', '515'].indexOf(item['Account']) > -1) {
  //       if (/^[3|5|4|9]/.test(item['Account'])) {
  //         item['HeadAmount'] = item['HeadCredit'] - item['HeadDebit'];
  //         item['IncrementAmount'] = (increment += item['HeadAmount'] + (item['GenerateCredit'] - item['GenerateDebit']));
  //       }
  //     }
  //     if (callback) callback(rs);
  //   });
  // }

  /** Config for paging */
  // protected configPaging() {
  //   return {
  //     display: true,
  //     perPage: 99999,
  //   };
  // }

  async refresh() {
    super.refresh();
  }

  openFormDialplog(ids?: string[], onDialogSave?: (newData: AccountModel[]) => void, onDialogClose?: () => void): void {
    throw new Error('Method not implemented.');
  }
}
