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
import { RootServices } from '../../../../../services/root.services';

@Component({
  selector: 'ngx-collaboartor-commission-detail',
  templateUrl: './collaboartor-commission-detail.component.html',
  styleUrls: ['./collaboartor-commission-detail.component.scss']
})
export class CollaboartorCommissionDetailComponent extends ServerDataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'CollaboartorCommissionDetailComponent';
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
  // tabs: any[];

  @Input('page') page?: string;
  @Input('publisher') publisher?: string;
  // @Input('accounts') accounts?: string[];
  // @Input('fromDate') fromDate?: Date;
  @Input('moment') moment?: Date;
  // @Input('report') report?: string;
  // @Input('awardCycle') awardCycle?: string;
  @Output() onInit = new EventEmitter<CollaboartorCommissionDetailComponent>();
  @Output() onUpdateTotalCommission = new EventEmitter<number>();

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboartorCommissionDetailComponent>,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.cms.waitForReady();
    // this.tabs = [
    //   {
    //     title: 'Liabilities',
    //     route: '/accounting/report/liabilities',
    //     icon: 'home',
    //     // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
    //   },
    //   {
    //     title: 'Receivables',
    //     route: '/accounting/report/receivables',
    //   },
    //   {
    //     title: 'Users',
    //     icon: 'person',
    //     route: './tab1',
    //   },
    //   {
    //     title: 'Orders',
    //     icon: 'paper-plane-outline',
    //     responsive: true,
    //     route: ['./tab2'],
    //   },
    //   {
    //     title: 'Transaction',
    //     icon: 'flash-outline',
    //     responsive: true,
    //     disabled: true,
    //   },
    // ];
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
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '5%',
        },
        Unit: {
          title: this.cms.translateText('ĐVT'),
          type: 'string',
          width: '5%',
        },
        Description: {
          title: this.cms.translateText('Sản phẩm'),
          type: 'string',
          width: '40%', 
        },
        SumOfQuantity: {
          title: this.cms.translateText('SL Bán'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: string, row: any) => {
            return `${row['SumOfQuantity']}/${row['ProductUnitLabel']}`;
          },
        },
        SumOfNetRevenue: {
          title: this.cms.translateText('Doanh số'),
          type: 'currency',
          width: '10%',
          valuePrepareFunction:(value) => value,
        },
        Level1CommissionRatio: {
          title: this.cms.translateText('TL Chiết khấu'),
          width: '10%',
          valuePrepareFunction:(value) => value + '%',
          type: 'custom',
          renderComponent: SmartTableBaseComponent,
          class: 'align-right',
          position: 'right',
          onComponentInitFunction: (instance: SmartTableBaseComponent) => {
            instance.style = 'text-align: right';
          }
        },
        CommissionAmount: {
          title: this.cms.translateText('Chiết khấu'),
          type: 'currency',
          width: '10%',
        },
        Preview: {
          title: this.cms.translateText('Common.detail'),
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
            instance.title = this.cms.translateText('Common.preview');
            // instance.label = this.cms.translateText('Common.detail');
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

      params['tempCommissionReport'] = true;
      params['page'] = this.page;
      params['publisher'] = this.publisher;
      params['moment'] = this.moment.toISOString();
      // params['awardCycle'] = this.awardCycle;


      return params;
    };
    

    source.prepareData = (data) => {
      let totalCommission = 0;
      for(const item of data) {
        totalCommission += item.TotalCommissionAmount;
      }
      this.onUpdateTotalCommission.next(totalCommission);
      return data;
    };
    return source;
  }

  async refresh() {
    super.refresh();
  }

}
