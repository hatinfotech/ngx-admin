import { AccMasterBookModel } from '../../../models/accounting.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ProductGroupModel } from '../../../models/product.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbColorHelper, NbDialogRef, NbThemeService } from '@nebular/theme';
import { concatMap, finalize, takeUntil, takeWhile } from 'rxjs/operators';
import { SolarData } from '../../../@core/data/solar';
import { ApiService } from '../../../services/api.service';
import { Icon } from '../../../lib/custom-element/card-header/card-header.component';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
import { PageModel } from '../../../models/page.model';

import { Subject, from } from 'rxjs';
import { lab } from 'd3-color';
import { CollaboratorService } from '../collaborator.service';
import { BaseComponent } from '../../../lib/base-component';
import { Router } from '@angular/router';
import { Select2Option } from '../../../lib/custom-element/select2/select2.component';
interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}
@Component({
  selector: 'ngx-collaborator-dashboard',
  templateUrl: './collaborator-dashboard.component.html',
  styleUrls: ['./collaborator-dashboard.component.scss'],
  providers: [CurrencyPipe, DecimalPipe]
})
export class CollaboratorDashboardComponent extends BaseComponent {

  componentName = 'CollaboratorDashboardComponent';

  groupList: ProductGroupModel[];
  formItem: FormGroup;

  size?: string = 'medium';
  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  title?: string = 'Phát sinh doanh thu/hoa hồng';
  actionButtonList: ActionControl[];

  costAndRevenueStatisticsData: {};
  goodsStatisticsData: {};
  debtCompareStatisticsData: {};
  cashFlowStatisticsData: {};
  debtStatisticsData: {};
  investStatisticsData: {};
  profitStatisticsData: {};
  orderStatisticsData: {};
  previousOrderStatisticsData: {};
  publisherRegisteredStatisticsData: {};
  options: any;
  optionsForCount: any;
  revenueOptions: any;
  costAndRevenueStatisticsDataOptions: any;
  colors: any;
  chartjs: any;

  summaryReport: {
    Cash?: number,
    TmpCommission?: number,
    Commission?: number,
    Award?: number,
    Gold?: number,
    CashInBank?: number,
    Revenues?: number,
    DecreaseRevenues?: number,
    Cost?: number,
    CustomerReceivableDebt?: number,
    LiabilitiesDebt?: number,
    Profit?: number,

    NumOfManagers?: number;
    NumOfSales?: number;
    NumOfPublishers?: number;
  };

  customerReceivableDebt = [];
  liabilitityDebt = [];
  topGoodsList = [];
  topEmployeeList = [];
  topOnlinePublishers = [];
  topOrderedPublishers = [];
  topAssignedPublishers = [];
  topNotOtderedPublishers = [];

  masterBook: AccMasterBookModel;

  flipped = false;
  filterChangedQueue$ = new Subject<any>();

  charts: { [key: string]: { type: string, options?: any, data: any } } = {};
  topListChoose = new FormControl('TOPORDEREDPUBLISHERS');

  dateReportList = [
    // { id: 'HOUR', text: 'Phân tích theo ngày', range: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)] },
    // { id: 'DAY', text: 'Phân tích theo tháng', range: [new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), 31, 23, 59, 59)] },
    // { id: 'DAYOFWEEK', text: 'Phân tích theo tuần', range: [this.getUpcomingMonday(), this.getUpcomingSunday()] },
    // { id: 'MONTH', text: 'Phân tích theo năm', range: [new Date(new Date().getFullYear(), 0, 1), new Date()] },
  ];

  constructor(
    public router: Router,
    private themeService: NbThemeService,
    private solarService: SolarData,
    public cms: CommonService,
    public formBuilder: FormBuilder,
    public collaboratorService: CollaboratorService,
    public apiService: ApiService,
    public currencyPipe: CurrencyPipe,
    public decimalPipe: DecimalPipe,
    public ref?: NbDialogRef<CollaboratorDashboardComponent>,
  ) {
    super(cms, router, apiService, ref)
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];

        this.colors = theme.variables;
        this.chartjs = theme.variables.chartjs;

        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Thời gian',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Giá trị',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                  callback: (value, index, values) => {
                    return this.currencyPipe.transform(value || 0, 'VND')
                  }
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                return this.currencyPipe.transform(tooltipItem.yLabel, 'VND');
              }
            }
          }
        };

        this.revenueOptions = {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Thời gian',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor
                },
                stacked: true,
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Giá trị',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                  callback: (value, index, values) => {
                    return this.currencyPipe.transform(value || 0, 'VND')
                  }
                },
                stacked: true,
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                return 'Tổng giá trị đơn hàng ' + data?.datasets[tooltipItem?.datasetIndex]?.label + ': ' + this.currencyPipe.transform(tooltipItem.yLabel, 'VND');
              }
            }
          }
        };

        // this.costAndRevenueStatisticsDataOptions = {
        //   ...this.options,

        // };
      });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });

    // this.apiService.getPromise<ProductGroupModel[]>('/collaborator/product-groups', { onlyIdText: true, limit: 'nolimit' }).then(rs => {
    //   this.groupList = [{ id: '', text: '' }, ...rs];
    // });

    // const currentDate = new Date();
    const today = new Date();
    this.formItem = this.formBuilder.group({
      // DateReport: [{ id: 'HOUR', text: 'Phân tích theo ngày (các giờ trong ngày)' }, Validators.required],
      DateReport: [{ id: 'DAY', text: 'Phân tích theo tháng (30 ngày gần nhất)' }, Validators.required],
      DateRange: [[this.cms.getBeginOfDate(today), this.cms.getEndOfDate(today)]],
      Publishers: [[]],
      ProductGroup: { value: '', disabled: true },
    });
    // this.formItem.get('DateReport').valueChanges.subscribe(value => {
    //   console.log(value);
    //   this.formItem.get('DateRange').setValue(this.dateReportList.find(f => f.id === this.cms.getObjectId(value)).range);
    // });

    this.filterChangedQueue$.pipe(
      takeUntil(this.destroy$),
      finalize(() => console.log('stopped processing queue')),
      concatMap(() => {
        return this.refresh();
      })
    ).subscribe(() => {
      console.log('On processed for filter change');
    });

    // setTimeout(() => {
    //   this.refresh();
    // }, 1000);
    // this.filterChangedQueue$.next(true);
    this.formItem.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // this.filterChangedQueue$.next(true);
      this.cms.takeOnce('collaborator-dashboard-filter-change', 1000).then(() => {
        this.refresh();
      });
    });

    this.cms.waitForReady().then(() => {
      this.actionButtonList = [
        {
          name: 'refresh',
          status: 'success',
          label: this.cms.textTransform(this.cms.translate.instant('Common.refresh'), 'head-title'),
          icon: 'sync',
          title: this.cms.textTransform(this.cms.translate.instant('Common.refresh'), 'head-title'),
          size: 'medium',
          disabled: () => {
            return false;
          },
          click: () => {
            this.refresh();
            return false;
          },
        },
      ];

      this.apiService.getPromise<AccMasterBookModel[]>('/accounting/master-books/current', {}).then(rs => {
        this.masterBook = rs[0];
        const today = new Date();
        const previousMonth = new Date(today.getTime() - 31 * 24 * 60 * 60 * 1000);
        let fromDate = new Date(this.masterBook.DateOfBeginning);
        const previous12month = today.clone();
        previous12month.setFullYear(previous12month.getFullYear() - 1);
        previous12month.setMonth(previous12month.getMonth() + 1);
        previous12month.setDate(1);
        this.dateReportList = [
          { id: 'HOUR', text: 'Phân tích theo ngày (các giờ trong ngày)', range: [this.cms.getBeginOfDate(today), this.cms.getEndOfDate(today)] },
          { id: 'DAYOFWEEK', text: 'Phân tích theo tuần (các ngày trong tuần)', range: [this.getUpcomingMonday(), this.getUpcomingSunday()] },
          { id: 'DAY', text: 'Phân tích theo tháng (30 ngày gần nhất)', range: [new Date(previousMonth.getFullYear(), previousMonth.getMonth(), previousMonth.getDate(), 0, 0, 0, 0), new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds())] },
          { id: 'MONTH', text: 'Phân tích theo năm (các tháng trong năm)', range: [previous12month, today] },
        ];
      });
      this.formItem.get('DateReport').valueChanges.subscribe(value => {
        console.log(value);
        this.formItem.get('DateRange').setValue(this.dateReportList.find(f => f.id === this.cms.getObjectId(value)).range);
      });
    });
  }

  select2OptionForPage = {
    placeholder: 'Tất cả chi nhánh...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  select2OptionForTopTab = {
    placeholder: 'Chọn danh sách top...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'TOPONLINEPUBLISHERS', text: 'Top CTV có vừa online' },
      { id: 'TOPORDEREDPUBLISHERS', text: 'Top CTV có vừa có đơn' },
      { id: 'TOPNOTORDEREDPUBLISHERS', text: 'Top CTV không có đơn' },
      { id: 'TOPASSIGNEDPUBLISHERS', text: 'Top CTV mới gia nhập' },
      { id: 'TOPPRODUCTSBYREVENUE', text: 'Top sản phẩm theo danh thu' },
      { id: 'TOPPUBLISHERSBYREVENUE', text: 'Top CTV theo danh thu' },
    ]
  };
  select2OptionForPublihsers: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/collaborator/publishers', {
      includeIdText: true,
      // includeGroups: true,
      // eq_IsDeleted: false,
      // sort_SearchRank: 'desc',
      // eq_Groups: '[PUBLISHER]',
    }, {
      placeholder: 'Chọn CTV Bán Hàng...', limit: 10, prepareReaultItem: (item) => {
        // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        item['id'] = item['Contact'];
        item['text'] = item['Name'];
        return item;
      }
    }),
    // minimumInputLength: 1,
    multiple: true,
  };

  select2DateReportOption: Select2Option = {
    placeholder: 'Chọn thời gian...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  // dayLabel = {
  //   "1": "Chủ nhật",
  //   "2": "Thứ hai",
  //   "3": "Thứ ba",
  //   "4": "Thứ tư",
  //   "5": "Thứ năm",
  //   "6": "Thứ sáu",
  //   "7": "Thứ bảy",
  // };

  onDateReportChange(dateReport: any) {
    console.log(dateReport);
  }

  select2ProductGroup = {
    placeholder: 'Tất cả nhóm sản phẩm...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    multiple: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  private alive = true;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Đơn hàng phát sinh',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Đơn hàng đã duyệt',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Doanh thu phát sinh',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Hoa hồng phát sinh',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.lightCard,
          type: 'warning',
        },
        {
          ...this.rollerShadesCard,
          type: 'primary',
        },
        {
          ...this.wirelessAudioCard,
          type: 'danger',
        },
        {
          ...this.coffeeMakerCard,
          type: 'info',
        },
      ],
      dark: this.commonStatusCardsSet,
    };

  ngOnDestroy() {
    this.alive = false;
  }

  onChangePage(page: PageModel) {

  }

  weekDayMap = {
    1: 'CN',
    2: 'T2',
    3: 'T3',
    4: 'T4',
    5: 'T5',
    6: 'T6',
    7: 'T7',
  };
  makeStaticLabel(item: any, reportType: string) {
    if (reportType === 'MONTH') {
      return (item['Month']).toString().padStart(2, "0") + '/' + (item['Year']).toString().padStart(2, "0");
    }
    if (reportType === 'DAY') {
      return (item['Day']).toString().padStart(2, "0") + '/' + (item['Month']).toString().padStart(2, "0");
    }
    if (reportType === 'HOUR') {
      return (item['Hour']).toString().padStart(2, "0");
    }
    return this.weekDayMap[item['DayOfWeek']] + ':' + (item['Day']).toString().padStart(2, "0") + '/' + (item['Month']).toString().padStart(2, "0");
  }

  makeTimeline(item: any, reportType: string) {
    if (reportType === 'MONTH') {
      return (item['Year']).toString().padStart(2, "0") + '/' + (item['Month']).toString().padStart(2, "0");
    }
    if (reportType === 'DAY') {
      return item['Year'] + '/' + (item['Month']).toString().padStart(2, "0") + '/' + (item['Day']).toString().padStart(2, "0");
    }
    if (reportType === 'HOUR') {
      return (item['Hour']).toString().padStart(2, "0");
    }
    return item['Year'] + '/' + (item['Month']).toString().padStart(2, "0") + '/' + (item['Day']).toString().padStart(2, "0");
    return (item['DayOfWeek']).toString().padStart(2, "0");
  }

  onPublisherClickClick(publisher: any) {
    this.formItem.get('Publishers').setValue([publisher]);
  }

  async refresh() {

    const promiseAll = [];
    const reportType = this.cms.getObjectId(this.formItem.get('DateReport').value);
    this.loading = true;

    // let branches = this.formItem.get('Branchs').value?.map(branch => this.cms.getObjectId(branch));
    // let products = this.formItem.get('Products')?.value?.map(m => this.cms.getObjectId(m)) || [];
    // let productGroups = this.formItem.get('ProductGroups')?.value?.map(m => this.cms.getObjectId(m)) || [];
    // let productCategories = this.formItem.get('ProductCategories')?.value?.map(m => this.cms.getObjectId(m)) || [];
    // let employees = this.formItem.get('Employees')?.value?.map(m => this.cms.getObjectId(m)) || [];
    // let objects = this.formItem.get('Objects')?.value?.map(m => this.cms.getObjectId(m)) || [];
    let publishersFilter = this.formItem.get('Publishers')?.value?.map(m => this.cms.getObjectId(m)) || [];

    // let pages = this.formItem.get('Page').value;
    // if (pages) {
    //   pages = pages.map(page => this.cms.getObjectId(page));
    //   pages = pages.join(',');
    // }

    const today = new Date();
    const dateRange: Date[] = this.formItem.get('DateRange').value;
    let fromDate = dateRange && dateRange[0] && (new Date(dateRange[0].getFullYear(), dateRange[0].getMonth(), dateRange[0].getDate(), 0, 0, 0, 0)) || null;
    let toDate = dateRange && dateRange[1] && new Date(dateRange[1].getFullYear(), dateRange[1].getMonth(), dateRange[1].getDate(), 23, 59, 59, 999) || null;

    let fromDateStr = fromDate.toISOString();
    let toDateStr = toDate.toISOString();

    let fromDateStrPrevious: string;
    let toDateStrPrevious: string;

    if (reportType == 'HOUR') {
      const previousFromDate = fromDate.clone();
      previousFromDate.setDate(fromDate.getDate() - 1);
      fromDateStrPrevious = previousFromDate.toISOString();

      const previousToDate = toDate.clone();
      previousToDate.setDate(toDate.getDate() - 1);
      toDateStrPrevious = previousToDate.toISOString();
    }
    if (reportType == 'DAYOFWEEK') {
      const previousFromDate = fromDate.clone();
      previousFromDate.setDate(fromDate.getDate() - 7);
      fromDateStrPrevious = previousFromDate.toISOString();

      const previousToDate = toDate.clone();
      previousToDate.setDate(toDate.getDate() - 7);
      toDateStrPrevious = previousToDate.toISOString();
    }
    if (reportType == 'DAY') {
      const previousFromDate = fromDate.clone();
      previousFromDate.setMonth(fromDate.getMonth() - 1);
      fromDateStrPrevious = previousFromDate.toISOString();

      const previousToDate = toDate.clone();
      previousToDate.setMonth(toDate.getMonth() - 1);
      toDateStrPrevious = previousToDate.toISOString();
    }
    if (reportType == 'MONTH') {
      const previousFromDate = fromDate.clone();
      previousFromDate.setFullYear(fromDate.getFullYear() - 1);
      fromDateStrPrevious = previousFromDate.toISOString();

      const previousToDate = toDate.clone();
      previousToDate.setFullYear(toDate.getFullYear() - 1);
      toDateStrPrevious = previousToDate.toISOString();
    }


    const extendproductsQuery = {
      // ...(products.length > 0 ? { eq_Product: `[${products.join(',')}]` } : {}),
      // ...(productGroups.length > 0 ? { eq_ProductGroup: `[${productGroups.join(',')}]` } : {}),
      // ...(productCategories.length > 0 ? { eq_ProductCategory: `[${productCategories.join(',')}]` } : {}),
      // ...(employees.length > 0 ? { eq_Employee: `[${employees.join(',')}]` } : {}),
      // ...(branches.length > 0 ? { eq_Branch: `[${branches.join(',')}]` } : {}),
      // ...(objects.length > 0 ? { eq_Object: `[${objects.join(',')}]` } : {}),
    }

    // const publishersQuery = {};
    // if (publishersFilter) {
    //   publishersQuery['eq_Publisher'] = '[' + publishersFilter.join(',') + ']';
    // }

    promiseAll.push(new Promise((resolve, reject) => {
      this.apiService.getPromise<any[]>('/collaborator/reports', { reportSummaryx: true, eq_Accounts: "511,521,515,521,632,635,642,641,623,2288,711,811,131,331,3349,", eq_VoucherType: '[CLBRTORDER,CLBRTCOMMISSION,CLBRTAWARD]', groupBy: 'Account', skipHeaderx: true, toDate: toDateStr, fromDatex: fromDateStr, limit: 'nolimit' }).then(async summaryReport => {
        // console.log(summaryReport);

        const humanResourceReport = await this.apiService.getPromise('/collaborator/reports', { humanResource: true });

        this.summaryReport = {
          TmpCommission: summaryReport.filter(f => /^3349/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.TailCredit), 0),
          Commission: summaryReport.filter(f => /^3348/.test(f.Account) && f.VoucherType == 'CLBRTCOMMISSION').reduce((sum, current) => sum + parseFloat(current.TailCredit), 0),
          Award: summaryReport.filter(f => /^3348/.test(f.Account) && f.VoucherType == 'CLBRTAWARD').reduce((sum, current) => sum + parseFloat(current.TailCredit), 0),
          Revenues: summaryReport.filter(f => /^511|515|711/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.TailCredit), 0),
          DecreaseRevenues: summaryReport.filter(f => /^521/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.TailDebit), 0),
          Cost: summaryReport.filter(f => /^632|642|635|623|641|811|521/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.TailDebit), 0),
          CustomerReceivableDebt: summaryReport.filter(f => /^131/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.TailDebit), 0),
          LiabilitiesDebt: summaryReport.filter(f => /^331/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.TailCredit), 0),
          NumOfPublishers: humanResourceReport['NumOfPublishers'],
          NumOfSales: humanResourceReport['NumOfSales'],
          NumOfManagers: 0,
        };
        this.summaryReport.Profit = this.summaryReport.Revenues - this.summaryReport.Cost;
      });
      // this.apiService.getPromise<any>('/collaborator/reports', { reportReceivablesFromCustomerx: true, eq_Accounts: '131', groupBy: 'Object', branch: pages, toDate: toDateStr, sort_TailDebit: 'desc' }).then(customerReceivableDebt => {
      //   this.customerReceivableDebt = customerReceivableDebt;
      //   console.log(customerReceivableDebt);
      // });
      // this.apiService.getPromise<any>('/collaborator/reports', { reportLiabilitiesz: true, eq_Accounts: '331', groupBy: 'Object', branch: pages, toDate: toDateStr, sort_TailCredit: 'desc' }).then(liabilitityDebt => {
      //   this.liabilitityDebt = liabilitityDebt;
      //   console.log(liabilitityDebt);
      // });
      this.apiService.getPromise<any>('/collaborator/reports', { eq_Accounts: '511,512,515', eq_VoucherType: 'CLBRTORDER', isn_Object: null, ne_ContraAccount: '911', groupBy: 'Product,ProductUnit', includeProductInfo: true, fromDate: fromDateStr, toDate: toDateStr, sort_CreditGenerate: 'desc', limit: 10, ...extendproductsQuery }).then(rs => {
        this.topGoodsList = rs;
        console.log(rs);
      });
      this.apiService.getPromise<any>('/collaborator/reports', { eq_Accounts: '511,512,515', eq_VoucherType: 'CLBRTORDER', isn_Product: null, ne_ContraAccount: '911', groupBy: 'Employee', includeEmployeeInfo: true, fromDate: fromDateStr, toDate: toDateStr, sort_CreditGenerate: 'desc', limit: 10, ...extendproductsQuery }).then(rs => {
        this.topEmployeeList = rs;
        console.log(rs);
      });
      this.apiService.getPromise<any>('/collaborator/publishers/top/online-publishers', { limit: 10 }).then(rs => {
        this.topOnlinePublishers = rs;
        console.log(rs);
      });
      this.apiService.getPromise<any>('/collaborator/publishers/top/ordered-publishers', { limit: 10 }).then(rs => {
        this.topOrderedPublishers = rs;
        console.log(rs);
      });
      this.apiService.getPromise<any>('/collaborator/publishers/top/assigned-publishers', { limit: 10 }).then(rs => {
        this.topAssignedPublishers = rs;
        console.log(rs);
      });
      this.apiService.getPromise<any>('/collaborator/publishers/top/not-ordered-publishers', { limit: 10 }).then(rs => {
        this.topNotOtderedPublishers = rs;
        console.log(rs);
      });

      resolve(true);
    }));

    let pointRadius: number = 1;
    if (reportType == 'MONTH') {
      pointRadius = 3;
    }

    if (reportType == 'DAY') {
      pointRadius = 2;
    }

    // Current
    promiseAll.push(new Promise(async (resolve, reject) => {
      let labels: any[], timeline: any[], mergeData: any[];
      let lineData = {};

      /** Load data */
      let statisticsData = await Promise.all([
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'NOTJUSTAPPROVED', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStr, le_DateOfOrder: toDateStr, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'PROCESSING', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStr, le_DateOfOrder: toDateStr, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'APPROVED', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStr, le_DateOfOrder: toDateStr, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'DEPLOYED', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStr, le_DateOfOrder: toDateStr, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
        // this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'COMPLETED', statisticsRevenue: true, branch: pages, reportBy: reportType, ge_DateOfOrder: fromDateStr, le_DateOfOrder: toDateStr, limit: 'nolimit' }),
        this.apiService.getPromise<any[]>('/collaborator/statistics', { eq_Account: "[511,515,521,711]", statisticsRevenue: true, reportBy: reportType, ge_VoucherDate: fromDateStr, le_VoucherDate: toDateStr, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Employee: '[' + publishersFilter.join(',') + ']' } || {}) }),
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'UNRECORDED', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStr, le_DateOfOrder: toDateStr, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
      ]);

      /** Prepare data */
      lineData['numOfOrderLine1Data'] = statisticsData[0].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      lineData['numOfOrderLine2Data'] = statisticsData[1].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      lineData['numOfOrderLine3Data'] = statisticsData[2].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      lineData['numOfOrderLine4Data'] = statisticsData[3].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      // lineData['numOfOrderLine5Data'] = statisticsData[4].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      lineData['numOfOrderLine5Data'] = statisticsData[4].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.NumOfOrders = parseInt(statistic.NumOfVouchers); statistic.Revenue = statistic.SumOfCredit - statistic.SumOfDebit; return statistic; });
      lineData['numOfOrderLine6Data'] = statisticsData[5].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });

      timeline = [...new Set([
        ...lineData['numOfOrderLine1Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine2Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine3Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine4Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine5Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine6Data'].map(item => item['Timeline']),
      ].sort())];
      labels = [];

      mergeData = timeline.map(t => {
        const point1 = lineData['numOfOrderLine1Data'].find(f => f.Timeline == t);
        const point2 = lineData['numOfOrderLine2Data'].find(f => f.Timeline == t);
        const point3 = lineData['numOfOrderLine3Data'].find(f => f.Timeline == t);
        const point4 = lineData['numOfOrderLine4Data'].find(f => f.Timeline == t);
        const point5 = lineData['numOfOrderLine5Data'].find(f => f.Timeline == t);
        const point6 = lineData['numOfOrderLine6Data'].find(f => f.Timeline == t);
        labels.push(
          point1?.Label
          || point2?.Label
          || point3?.Label
          || point4?.Label
          || point5?.Label
          || point6?.Label
        );
        return {
          Label: t,
          Line1: point1 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line2: point2 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line3: point3 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line4: point4 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line5: point5 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line6: point6 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
        };
      });

      // Chart 1
      this.charts['order'] = {
        type: 'bar',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Chu kỳ hiện tại',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor
                },
                stacked: true,
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Đơn hàng',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                  callback: (value, index, values) => {
                    return this.decimalPipe.transform(value || 0, '1.0-0');
                  }
                },
                stacked: true,
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                if (data?.datasets) {
                  let sum = data.datasets.reduce((previous, dataset) => { return previous + parseInt(dataset.data[tooltipItem.index]); }, 0);
                  return this.decimalPipe.transform(tooltipItem.yLabel, '1.0-0') + '/' + this.decimalPipe.transform(sum, '1.0-0') + ' đơn ' + data?.datasets[tooltipItem?.datasetIndex]?.label;
                }
                return '';
              }
            }
          }
        },
        data: {
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: 'KPI',
              data: mergeData.map(point => 10),
              borderDash: [5, 5],
              borderColor: NbColorHelper.tint(NbColorHelper.mix(this.colors.danger, this.colors.primary, 66), 0),
              // backgroundColor: NbColorHelper.shade(this.colors.warning, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Hoàn tất',
              data: mergeData.map(point => point.Line5['NumOfOrders']),
              borderColor: this.colors.success,
              backgroundColor: NbColorHelper.hexToRgbA(this.colors.success, 1),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đã triển khai',
              data: mergeData.map(point => point.Line4['NumOfOrders']),
              borderColor: NbColorHelper.mix(this.colors.danger, this.colors.warning, 66),
              backgroundColor: NbColorHelper.shade(NbColorHelper.mix(this.colors.danger, this.colors.warning, 66), 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đã chốt',
              data: mergeData.map(point => point.Line3['NumOfOrders']),
              borderColor: this.colors.primary,
              backgroundColor: NbColorHelper.shade(this.colors.primary, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đang xử lý',
              data: mergeData.map(point => point.Line2['NumOfOrders']),
              borderColor: this.colors.info,
              backgroundColor: NbColorHelper.shade(this.colors.info, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Chưa xử lý',
              data: mergeData.map(point => point.Line1['NumOfOrders']),
              borderColor: this.colors.warning,
              backgroundColor: NbColorHelper.shade(this.colors.warning, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đơn bị hủy',
              data: mergeData.map(point => point.Line6['NumOfOrders']),
              borderColor: this.colors.danger,
              backgroundColor: NbColorHelper.shade(this.colors.danger, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
          ],
        }
      };

      // Chart 2
      this.charts['revenue'] = {
        type: 'bar',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Thời gian',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor
                },
                stacked: true,
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Giá trị',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                  callback: (value, index, values) => {
                    return this.currencyPipe.transform(value || 0, 'VND')
                  }
                },
                stacked: true,
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                let sum = data.datasets.reduce((previous, dataset) => { return previous + parseFloat(dataset.data[tooltipItem.index]); }, 0);
                return 'Tổng giá trị đơn hàng ' + data?.datasets[tooltipItem?.datasetIndex]?.label + ': ' + this.currencyPipe.transform(tooltipItem.yLabel, 'VND') + '/' + this.currencyPipe.transform(sum, 'VND');
              }
            }
          }
        },
        data: {
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: 'KPI',
              data: mergeData.map(point => 4000000),
              borderDash: [5, 5],
              borderColor: NbColorHelper.tint(NbColorHelper.mix(this.colors.danger, this.colors.primary, 66), 0),
              // backgroundColor: NbColorHelper.shade(this.colors.warning, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Hoàn tất',
              data: mergeData.map(point => point.Line5['Revenue']),
              borderColor: this.colors.success,
              backgroundColor: NbColorHelper.shade(this.colors.successLight, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đã triển khai',
              data: mergeData.map(point => point.Line4['Revenue']),
              borderColor: NbColorHelper.mix(this.colors.danger, this.colors.warning, 66),
              backgroundColor: NbColorHelper.shade(NbColorHelper.mix(this.colors.danger, this.colors.warning, 66), 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đã chốt',
              data: mergeData.map(point => point.Line3['Revenue']),
              borderColor: this.colors.primary,
              backgroundColor: NbColorHelper.shade(this.colors.primary, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đang xử lý',
              data: mergeData.map(point => point.Line2['Revenue']),
              borderColor: this.colors.info,
              backgroundColor: NbColorHelper.shade(this.colors.info, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              // type: 'line',
              label: 'Đơn mới',
              data: mergeData.map(point => point.Line1['Revenue']),
              borderColor: this.colors.warning,
              backgroundColor: NbColorHelper.shade(this.colors.warning, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đơn bị hủy',
              data: mergeData.map(point => point.Line6['Revenue']),
              borderColor: this.colors.danger,
              backgroundColor: NbColorHelper.shade(this.colors.danger, 0),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
          ],
        }
      };
      resolve(true);
    }));

    // Previous chart
    promiseAll.push(new Promise(async (resolve, reject) => {
      let labels: any[], timeline: any[], mergeData: any[];
      let lineData = {};

      /** Load data */
      let statisticsData = await Promise.all([
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'NOTJUSTAPPROVED', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStrPrevious, le_DateOfOrder: toDateStrPrevious, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'PROCESSING', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStrPrevious, le_DateOfOrder: toDateStrPrevious, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'APPROVED', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStrPrevious, le_DateOfOrder: toDateStrPrevious, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'DEPLOYED', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStrPrevious, le_DateOfOrder: toDateStrPrevious, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
        // this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'COMPLETED', statisticsRevenue: true, branch: pages, reportBy: reportType, ge_DateOfOrder: fromDateStrPrevious, le_DateOfOrder: toDateStrPrevious, limit: 'nolimit' }),
        this.apiService.getPromise<any[]>('/collaborator/statistics', { eq_Account: "[511,515,521,711]", statisticsRevenue: true, reportBy: reportType, ge_VoucherDate: fromDateStrPrevious, le_VoucherDate: toDateStrPrevious, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Employee: '[' + publishersFilter.join(',') + ']' } || {}) }),
        this.apiService.getPromise<any[]>('/collaborator/orders/statistics', { state: 'UNRECORDED', statisticsRevenue: true, reportBy: reportType, ge_DateOfOrder: fromDateStrPrevious, le_DateOfOrder: toDateStrPrevious, limit: 'nolimit', ...(publishersFilter && publishersFilter.length > 0 && { eq_Publisher: '[' + publishersFilter.join(',') + ']' } || {}) }),
      ]);

      /** Prepare data */
      lineData['numOfOrderLine1Data'] = statisticsData[0].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      lineData['numOfOrderLine2Data'] = statisticsData[1].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      lineData['numOfOrderLine3Data'] = statisticsData[2].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      lineData['numOfOrderLine4Data'] = statisticsData[3].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      // lineData['numOfOrderLine5Data'] = statisticsData[4].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });
      lineData['numOfOrderLine5Data'] = statisticsData[4].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.NumOfOrders = statistic.NumOfVouchers; statistic.Revenue = statistic.SumOfCredit - statistic.SumOfDebit; return statistic; });
      lineData['numOfOrderLine6Data'] = statisticsData[5].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.NumOfOrders; return statistic; });

      timeline = [...new Set([
        ...lineData['numOfOrderLine1Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine2Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine3Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine4Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine5Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine6Data'].map(item => item['Timeline']),
      ].sort())];
      labels = [];

      mergeData = timeline.map(t => {
        const point1 = lineData['numOfOrderLine1Data'].find(f => f.Timeline == t);
        const point2 = lineData['numOfOrderLine2Data'].find(f => f.Timeline == t);
        const point3 = lineData['numOfOrderLine3Data'].find(f => f.Timeline == t);
        const point4 = lineData['numOfOrderLine4Data'].find(f => f.Timeline == t);
        const point5 = lineData['numOfOrderLine5Data'].find(f => f.Timeline == t);
        const point6 = lineData['numOfOrderLine6Data'].find(f => f.Timeline == t);
        labels.push(
          point1?.Label
          || point2?.Label
          || point3?.Label
          || point4?.Label
          || point5?.Label
          || point6?.Label
        );
        return {
          Label: t,
          Line1: point1 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line2: point2 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line3: point3 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line4: point4 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line5: point5 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          Line6: point6 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
        };
      });

      const xTitle = reportType == 'HOUR' ? 'Hôm trước' : (reportType == 'DAY' ? 'Tháng trước' : (reportType == 'DAYOFWEEK' ? 'Tuần trước' : (reportType == 'MONTH' ? 'Năm trước' : 'Chu kỳ trước')));
      // Chart 1
      this.charts['orderPrevious'] = {
        type: 'bar',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: xTitle,
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor
                },
                stacked: true,
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Đơn hàng',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                  callback: (value, index, values) => {
                    return this.decimalPipe.transform(value || 0, '1.0-0');
                  }
                },
                stacked: true,
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                if (data?.datasets) {
                  let sum = data.datasets.reduce((previous, dataset) => { return previous + parseInt(dataset.data[tooltipItem.index]); }, 0);
                  return this.decimalPipe.transform(tooltipItem.yLabel, '1.0-0') + '/' + this.decimalPipe.transform(sum, '1.0-0') + ' đơn ' + data?.datasets[tooltipItem?.datasetIndex]?.label;
                }
                return '';
              }
            }
          }
        },
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Hoàn tất',
              data: mergeData.map(point => point.Line5['NumOfOrders']),
              borderColor: this.colors.success,
              backgroundColor: NbColorHelper.shade(this.colors.success, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đã triển khai',
              data: mergeData.map(point => point.Line4['NumOfOrders']),
              borderColor: NbColorHelper.mix(this.colors.danger, this.colors.warning, 66),
              backgroundColor: NbColorHelper.shade(NbColorHelper.mix(this.colors.danger, this.colors.warning, 66), 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đã chốt',
              data: mergeData.map(point => point.Line3['NumOfOrders']),
              borderColor: this.colors.primary,
              backgroundColor: NbColorHelper.shade(this.colors.primary, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đang xử lý',
              data: mergeData.map(point => point.Line2['NumOfOrders']),
              borderColor: this.colors.info,
              backgroundColor: NbColorHelper.shade(this.colors.info, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đơn mới',
              data: mergeData.map(point => point.Line1['NumOfOrders']),
              borderColor: this.colors.warning,
              backgroundColor: NbColorHelper.shade(this.colors.warning, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đơn bị hủy',
              data: mergeData.map(point => point.Line6['NumOfOrders']),
              borderColor: this.colors.danger,
              backgroundColor: NbColorHelper.shade(this.colors.danger, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
          ],
        }
      };

      // Chart 2
      this.charts['revenuePrevious'] = {
        type: 'bar',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: xTitle,
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor
                },
                stacked: true,
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Giá trị',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                  callback: (value, index, values) => {
                    return this.currencyPipe.transform(value || 0, 'VND')
                  }
                },
                stacked: true,
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                let sum = data.datasets.reduce((previous, dataset) => { return previous + parseFloat(dataset.data[tooltipItem.index]); }, 0);
                return 'Tổng giá trị đơn hàng ' + data?.datasets[tooltipItem?.datasetIndex]?.label + ': ' + this.currencyPipe.transform(tooltipItem.yLabel, 'VND') + '/' + this.currencyPipe.transform(sum, 'VND');
              }
            }
          }
        },
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Hoàn tất',
              data: mergeData.map(point => point.Line5['Revenue']),
              borderColor: this.colors.successLight,
              backgroundColor: NbColorHelper.shade(this.colors.successLight, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đã triển khai',
              data: mergeData.map(point => point.Line4['Revenue']),
              borderColor: NbColorHelper.mix(this.colors.danger, this.colors.warning, 66),
              backgroundColor: NbColorHelper.shade(NbColorHelper.mix(this.colors.danger, this.colors.warning, 66), 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đã chốt',
              data: mergeData.map(point => point.Line3['Revenue']),
              borderColor: this.colors.primaryLight,
              backgroundColor: NbColorHelper.shade(this.colors.primaryLight, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đang xử lý',
              data: mergeData.map(point => point.Line2['Revenue']),
              borderColor: this.colors.infoLight,
              backgroundColor: NbColorHelper.shade(this.colors.infoLight, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đơn mới',
              data: mergeData.map(point => point.Line1['Revenue']),
              borderColor: this.colors.warningLight,
              backgroundColor: NbColorHelper.shade(this.colors.warningLight, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Đơn bị hủy',
              data: mergeData.map(point => point.Line6['Revenue']),
              borderColor: this.colors.dangerLight,
              backgroundColor: NbColorHelper.shade(this.colors.dangerLight, 50),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
          ],
        }
      };
      resolve(true);
    }));

    // Publisher statistics
    promiseAll.push(new Promise(async (resolve, reject) => {
      let labels: any[], timeline: any[], mergeData: any[];
      let lineData = {};

      /** Load data */
      let statisticsData = await Promise.all([
        this.apiService.getPromise<any[]>('/collaborator/publishers/statistics/online-publishers', { reportBy: reportType, le_DateOfLog: toDateStr, ge_DateOfLog: fromDateStr, limit: 'nolimit' }),
        this.apiService.getPromise<any[]>('/collaborator/publishers/statistics/ordered-publishers', { reportBy: reportType, le_DateOfLog: toDateStr, ge_DateOfLog: fromDateStr, limit: 'nolimit' }),
        this.apiService.getPromise<any[]>('/collaborator/publishers/statistics/created-publishers', { reportBy: reportType, le_DateOfLog: toDateStr, ge_DateOfLog: fromDateStr, limit: 'nolimit' }),
        // this.apiService.getPromise<any[]>('/collaborator/publishers/top/online-publishers', { limit: 10 }),
        // this.apiService.getPromise<any[]>('/collaborator/publishers/top/ordered-publishers', { limit: 10 }),
      ]);

      /** Prepare data */
      lineData['numOfOrderLine1Data'] = statisticsData[0].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); return statistic; });
      lineData['numOfOrderLine2Data'] = statisticsData[1].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); return statistic; });
      lineData['numOfOrderLine3Data'] = statisticsData[2].map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); return statistic; });

      timeline = [...new Set([
        ...lineData['numOfOrderLine1Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine2Data'].map(item => item['Timeline']),
        ...lineData['numOfOrderLine3Data'].map(item => item['Timeline']),
      ].sort())];
      labels = [];

      mergeData = timeline.map(t => {
        const point1 = lineData['numOfOrderLine1Data'].find(f => f.Timeline == t);
        const point2 = lineData['numOfOrderLine2Data'].find(f => f.Timeline == t);
        const point3 = lineData['numOfOrderLine3Data'].find(f => f.Timeline == t);
        labels.push(
          point1?.Label
          || point2?.Label
          || point3?.Label
          // || point4?.Label
          // || point5?.Label
          // || point6?.Label
        );
        return {
          Label: t,
          Line1: point1 || { Value: 0 },
          Line2: point2 || { Value: 0 },
          Line3: point3 || { Value: 0 },
          // Line4: point4 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          // Line5: point5 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
          // Line6: point6 || { Value: 0, NumOfOrders: 0, Revenue: 0 },
        };
      });

      // Chart 1
      this.charts['publisher'] = {
        type: 'line',
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          hover: {
            mode: 'index',
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Thời gian',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor
                },
                // stacked: true,
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'CTV Bán Hàng',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                  callback: (value, index, values) => {
                    return this.decimalPipe.transform(value || 0, '1.0-0');
                  }
                },
                // stacked: true,
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                if (data?.datasets) {
                  return this.decimalPipe.transform(tooltipItem.yLabel, '1.0-0') + ' CTV ' + data?.datasets[tooltipItem?.datasetIndex]?.label;
                }
                return '';
              }
            }
          }
        },
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Online',
              data: mergeData.map(point => point.Line1['Value']),
              borderColor: this.colors.info,
              backgroundColor: NbColorHelper.hexToRgbA(this.colors.info, 0.2),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Có đơn',
              data: mergeData.map(point => point.Line2['Value']),
              borderColor: this.colors.success,
              backgroundColor: NbColorHelper.hexToRgbA(this.colors.success, 0.2),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            {
              label: 'Mới',
              data: mergeData.map(point => point.Line3['Value']),
              borderColor: this.colors.warning,
              backgroundColor: NbColorHelper.hexToRgbA(this.colors.warning, 0.2),
              pointRadius: pointRadius,
              pointHoverRadius: 10,
            },
            // {
            //   label: 'Đặt hàng',
            //   data: mergeData.map(point => point.Line2['Value']),
            //   borderColor: NbColorHelper.mix(this.colors.danger, this.colors.warning, 66),
            //   backgroundColor: NbColorHelper.shade(NbColorHelper.mix(this.colors.danger, this.colors.warning, 66), 0),
            //   pointRadius: pointRadius,
            //   pointHoverRadius: 10,
            // },
            // {
            //   label: 'Đã chốt',
            //   data: mergeData.map(point => point.Line3['NumOfOrders']),
            //   borderColor: this.colors.primary,
            //   backgroundColor: NbColorHelper.shade(this.colors.primary, 0),
            //   pointRadius: pointRadius,
            //   pointHoverRadius: 10,
            // },
            // {
            //   label: 'Đang xử lý',
            //   data: mergeData.map(point => point.Line2['NumOfOrders']),
            //   borderColor: this.colors.info,
            //   backgroundColor: NbColorHelper.shade(this.colors.info, 0),
            //   pointRadius: pointRadius,
            //   pointHoverRadius: 10,
            // },
            // {
            //   label: 'Đơn mới',
            //   data: mergeData.map(point => point.Line1['NumOfOrders']),
            //   borderColor: this.colors.warning,
            //   backgroundColor: NbColorHelper.shade(this.colors.warning, 0),
            //   pointRadius: pointRadius,
            //   pointHoverRadius: 10,
            // },
            // {
            //   label: 'Đơn bị hủy',
            //   data: mergeData.map(point => point.Line6['NumOfOrders']),
            //   borderColor: this.colors.danger,
            //   backgroundColor: NbColorHelper.shade(this.colors.danger, 0),
            //   pointRadius: pointRadius,
            //   pointHoverRadius: 10,
            // },
          ],
        }
      };
      resolve(true);
    }));


    // await Promise.all([promise1, promise1_1, promise2, promise3, promise4, promise5, promise6, promise7]);
    await Promise.all(promiseAll).then(rs => {
      this.loading = false;
      return rs;
    }).catch(err => {
      this.loading = false;
      return Promise.reject(err);
    });
    return true;

  }

  getUpcomingMonday() {
    const date = new Date();
    const today = date.getDate();
    const dayOfTheWeek = date.getDay();
    const newDate = date.setDate(today - dayOfTheWeek + 1);
    const result = new Date(newDate);
    result.setHours(0);
    result.setMinutes(0);
    result.setSeconds(0);
    return result;
  }
  getUpcomingSunday() {
    const date = new Date();
    const today = date.getDate();
    const dayOfTheWeek = date.getDay();
    const newDate = date.setDate(today - dayOfTheWeek + 7);
    const result = new Date(newDate);
    result.setHours(23);
    result.setMinutes(59);
    result.setSeconds(59);
    return result;
  }
}
