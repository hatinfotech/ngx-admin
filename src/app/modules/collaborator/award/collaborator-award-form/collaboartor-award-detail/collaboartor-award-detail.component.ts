import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { SmartTableTagsComponent, SmartTableButtonComponent, SmartTableBaseComponent } from '../../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../../lib/data-manager/server-data-manger-list.component';
import { AccountModel } from '../../../../../models/accounting.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'ngx-collaboartor-award-detail',
  templateUrl: './collaboartor-award-detail.component.html',
  styleUrls: ['./collaboartor-award-detail.component.scss']
})
export class CollaboartorAwardDetailComponent extends ServerDataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'CollaboartorAwardDetailComponent';
  formPath = '/accounting/account/form';
  apiPath = '/collaborator/statistics';
  idKey = 'Code';
  // formDialog = AccAccountFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  totalBalance: { Debit: number, Credit: number } = null;
  tabs: any[];

  @Input('page') page?: string;
  @Input('publisher') publisher?: string;
  // @Input('accounts') accounts?: string[];
  // @Input('fromDate') fromDate?: Date;
  @Input('moment') moment?: Date;
  // @Input('report') report?: string;
  @Input('awardCycle') awardCycle?: string;
  @Output() onInit = new EventEmitter<CollaboartorAwardDetailComponent>();
  @Output() onUpdateTotalAward = new EventEmitter<number>();

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboartorAwardDetailComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.commonService.waitForReady();
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
    return super.init().then(rs => {
      // this.actionButtonList = this.actionButtonList.filter(f => f.name !== 'choose');
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'add', 'choose', 'preview'].indexOf(f.name) < 0);
      this.onInit.emit(this);
      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    const settings = this.configSetting({
      actions: false,
      columns: {
        Product: {
          title: this.commonService.translateText('Common.code'),
          type: 'string',
          width: '5%',
        },
        Unit: {
          title: this.commonService.translateText('ĐVT'),
          type: 'string',
          width: '5%',
        },
        // ObjectName: {
        //   title: this.commonService.translateText('Common.contactName'),
        //   type: 'string',
        //   width: '15%',
        // },
        Description: {
          title: this.commonService.translateText('Sản phẩm'),
          type: 'string',
          width: '10%', 
        },
        // Voucher: {
        //   title: this.commonService.translateText('Common.voucher'),
        //   type: 'custom',
        //   renderComponent: SmartTableTagsComponent,
        //   valuePrepareFunction: (cell: string, row: any) => {
        //     return [{ id: cell, text: row['Description'], type: row['VoucherType'] }] as any;
        //   },
        //   onComponentInitFunction: (instance: SmartTableTagsComponent) => {
        //     instance.click.subscribe((tag: { id: string, text: string, type: string }) => tag.type && this.commonService.previewVoucher(tag.type, tag.id));
        //   },
        //   width: '10%',
        // },
        SumOfQuantity: {
          title: this.commonService.translateText('KPI đạt được'),
          type: 'string',
          width: '5%',
        },
        Level1Kpi: {
          title: this.commonService.translateText('KPI yêu cầu'),
          type: 'string',
          width: '5%',
        },
        SumOfNetRevenue: {
          title: this.commonService.translateText('Doanh số'),
          type: 'currency',
          width: '5%',
          valuePrepareFunction:(value) => value,
        },
        Level1AwardRatio: {
          title: this.commonService.translateText('TL thưởng'),
          width: '5%',
          valuePrepareFunction:(value) => value + '%',
          type: 'custom',
          renderComponent: SmartTableBaseComponent,
          class: 'align-right',
          position: 'right',
          onComponentInitFunction: (instance: SmartTableBaseComponent) => {
            instance.style = 'text-align: right';
          }
        },
        Level1AwardAmount: {
          title: this.commonService.translateText('Tiền thưởng'),
          type: 'currency',
          width: '7%',
        },
        ExtSumOfNetRevenue: {
          title: this.commonService.translateText('D.Số học trò'),
          type: 'currency',
          width: '8%',
        },
        Level2ExtAwardRatio: {
          title: this.commonService.translateText('TL thưởng LV2'),
          // type: 'string',
          width: '7%',
          valuePrepareFunction:(value) => value + '%',
          type: 'custom',
          renderComponent: SmartTableBaseComponent,
          class: 'align-right',
          position: 'right',
          onComponentInitFunction: (instance: SmartTableBaseComponent) => {
            instance.style = 'text-align: right';
          }
        },
        Level2ExtAwardAmount: {
          title: this.commonService.translateText('Thưởng LV2'),
          type: 'currency',
          width: '8%',
          valuePrepareFunction:(value) => value,
        },
        Level3ExtAwardRatio: {
          title: this.commonService.translateText('TL thưởng LV3'),
          // type: 'string',
          width: '7%',
          valuePrepareFunction:(value) => value + '%',
          type: 'custom',
          renderComponent: SmartTableBaseComponent,
          class: 'align-right',
          position: 'right',
          onComponentInitFunction: (instance: SmartTableBaseComponent) => {
            instance.style = 'text-align: right';
          }
        },
        Level3ExtAwardAmount: {
          title: this.commonService.translateText('Thưởng LV3'),
          type: 'currency',
          width: '8%',
          valuePrepareFunction:(value) => value,
        },
        TotalAwardAmount: {
          title: this.commonService.translateText('Tổng thưởng'),
          type: 'currency',
          width: '10%',
        },
        // SumOfMonthlyQuantity: {
        //   title: this.commonService.translateText('Số lượng theo tháng'),
        //   type: 'string',
        //   width: '10%',
        // },
        // SumOfQuarterlyQuantity: {
        //   title: this.commonService.translateText('Số lượng theo quý'),
        //   type: 'string',
        //   width: '10%',
        // },
        // SumOfYearlyQuantity: {
        //   title: this.commonService.translateText('Số lượng theo năm'),
        //   type: 'string',
        //   width: '10%',
        // },
        // HeadAmount: {
        //   title: this.commonService.translateText('Accounting.headAmount'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        // GenerateAmount: {
        //   title: this.commonService.translateText('Accounting.generate'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        // IncrementAmount: {
        //   title: this.commonService.translateText('Accounting.increment'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        // TailAmount: {
        //   title: this.commonService.translateText('Accounting.tailAmount'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        Preview: {
          title: this.commonService.translateText('Common.detail'),
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
            // instance.label = this.commonService.translateText('Common.detail');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            // instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
            //   this.getFormData([rowData.Code]).then(rs => {
            //     this.preview(rs);
            //   });
            // });
          },
        }
      },
    });
    delete settings.columns['Choose'];
    return settings;
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {

      // if (this.employee) {
      //   // params['eq_Object'] = this.object;
      //   params['eq_Employee'] = this.employee;
      // }
      // if (this.accounts) {
      //   params['eq_Account'] = this.accounts.join(',');
      // }
      // if (this.report) {
      //   params[this.report] = true;
      // } else {
      //   params['reportDetailByObject'] = true;
      // }
      // params['includeIncrementAmount'] = true;
      // if (this.fromDate) {
      //   const formDate = this.fromDate instanceof Date ? this.fromDate : new Date(this.fromDate);
      //   params['fromDate'] = new Date(formDate.getFullYear(), formDate.getMonth(), formDate.getDate(), 0, 0, 0).toISOString();
      // }
      // if (this.toDate) {
      //   const toDate = this.toDate instanceof Date ? this.toDate : new Date(this.toDate);
      //   params['toDate'] = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59).toISOString();
      // }
      // if (this.page) {
      //   params['eq_Page'] = this.page;
      // }

      params['tempAwardReport'] = true;
      params['page'] = this.page;
      params['publisher'] = this.publisher;
      params['moment'] = this.moment.toISOString();
      params['awardCycle'] = this.awardCycle;


      return params;
    };
    

    source.prepareData = (data) => {
      let totalAward = 0;
      for(const item of data) {
        totalAward += item.TotalAwardAmount;
      }
      this.onUpdateTotalAward.next(totalAward);
      return data;
    };
    return source;
  }

  async refresh() {
    super.refresh();
  }

}
