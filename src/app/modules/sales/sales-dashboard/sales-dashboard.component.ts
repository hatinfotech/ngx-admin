import { CurrencyPipe } from '@angular/common';
import { ProductGroupModel } from '../../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { SolarData } from '../../../@core/data/solar';
import { ApiService } from '../../../services/api.service';
import { Icon } from '../../../lib/custom-element/card-header/card-header.component';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
import { PageModel } from '../../../models/page.model';
import { AccMasterBookModel } from '../../../models/accounting.model';
import { Select2Option } from '../../../lib/custom-element/select2/select2.component';
interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}
@Component({
  selector: 'ngx-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss'],
  providers: [CurrencyPipe]
})
export class SalesDashboardComponent implements OnDestroy {

  // groupList: ProductGroupModel[];
  formItem: FormGroup;

  size?: string = 'medium';
  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  title?: string = 'Phát sinh doanh thu/hoa hồng';
  actionButtonList: ActionControl[];

  costAndRevenueStatisticsData: {};
  goodsStatisticsData: {};
  cashFlowStatisticsData: {};
  debtStatisticsData: {};
  profitStatisticsData: {};
  orderStatisticsData: {};
  publisherRegisteredStatisticsData: {};
  options: any;
  costAndRevenueStatisticsDataOptions: any;
  colors: any;
  chartjs: any;

  summaryReport: {
    Cash?: number,
    HeadCash?: number,
    CashInBank?: number,
    HeadCashInBank?: number,
    Revenues?: number,
    DecreaseRevenues?: number,
    DecreaseRevenuesByReturns?: number,
    DecreaseRevenuesByDiscount?: number,
    CostOfGoodsSold?: number,
    Cost?: number,
    CustomerReceivableDebt?: number,
    CustomerReceivableHeadDebt?: number,
    LiabilitiesDebt?: number,
    HeadProfit?: number,
    Profit?: number,
  };

  topEmployeeList = [];
  topCustomerList = [];
  topGoodsList = [];

  masterBook: AccMasterBookModel;

  constructor(
    private themeService: NbThemeService,
    private solarService: SolarData,
    public commonService: CommonService,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public currencyPipe: CurrencyPipe,
  ) {
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
      });

    this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', { onlyIdText: true }).then(rs => {
      this.productGroupList = rs;
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });

    // const currentDate = new Date();
    this.formItem = this.formBuilder.group({
      DateReport: ['DAY'],
      DateRange: [this.dateReportList.find(f => f.id === 'DAY').range],
      Page: [[]],
      ProductGroups: [[]],
      Products: [[]],
    });
    this.formItem.get('DateReport').valueChanges.subscribe(value => {
      console.log(value);
      this.formItem.get('DateRange').setValue(this.dateReportList.find(f => f.id === this.commonService.getObjectId(value)).range);
    });

    // setTimeout(() => {
    //   this.refresh();
    // }, 1000);
    this.formItem.valueChanges.subscribe(() => {
      this.refresh();
    });

    this.commonService.waitForReady().then(() => {
      this.actionButtonList = [
        {
          name: 'refresh',
          status: 'success',
          label: this.commonService.textTransform(this.commonService.translate.instant('Common.refresh'), 'head-title'),
          icon: 'sync',
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.refresh'), 'head-title'),
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
        const current = new Date();
        const previousMonth = new Date(current.getTime() - 31 * 24 * 60 * 60 * 1000);
        let fromDate = new Date(this.masterBook.DateOfBeginning);
        this.dateReportList = [
          { id: 'DAY', text: 'Phân tích 30 ngày gần nhất', range: [new Date(previousMonth.getFullYear(), previousMonth.getMonth(), previousMonth.getDate(), 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), current.getDate(), current.getHours(), current.getMinutes(), current.getSeconds(), current.getMilliseconds())] },
          { id: 'MONTH', text: 'Phân tích 12 tháng gần nhất', range: [new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()), new Date(new Date().getFullYear(), 11, 31)] },
          { id: 'DAYOFWEEK', text: 'Phân tích theo các ngày trong tuần', range: [this.getUpcomingMonday(), this.getUpcomingSunday()] },
          { id: 'HOUR', text: 'Phân tích theo từng giờ trong ngày', range: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)] },
        ];
        this.refresh();
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

  select2OptionForProduct: Select2Option = {
    ...this.commonService.makeSelect2AjaxOption('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", includeSearchResultLabel: true, includeUnits: true }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa/dịch vụ...',
      prepareReaultItem: (item) => {
        item.thumbnail = item?.FeaturePicture?.Thumbnail;
        return item;
      }
    }),
    multiple: true,
    withThumbnail: true,
  };

  select2DateReportOption = {
    placeholder: 'Chọn thời gian...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  dateReportList = [
    { id: 'DAY', text: 'Phân tích theo ngày', range: [new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), 31, 23, 59, 59)] },
    { id: 'MONTH', text: 'Phân tích theo tháng', range: [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)] },
    { id: 'DAYOFWEEK', text: 'Phân tích theo tuần', range: [this.getUpcomingMonday(), this.getUpcomingSunday()] },
    { id: 'HOUR', text: 'Phân tích theo giờ', range: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)] },
  ];

  dayLabel = {
    "1": "Chủ nhật",
    "2": "Thứ hai",
    "3": "Thứ ba",
    "4": "Thứ tư",
    "5": "Thứ năm",
    "6": "Thứ sáu",
    "7": "Thứ bảy",
  };

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

  productGroupList: ProductGroupModel[] = [];

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
    return (item['DayOfWeek']).toString().padStart(2, "0");
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
    return (item['DayOfWeek']).toString().padStart(2, "0");
  }

  async refresh() {
    const reportType = this.commonService.getObjectId(this.formItem.get('DateReport').value);
    let pages = this.formItem.get('Page').value;
    if (pages) {
      pages = pages.map(page => this.commonService.getObjectId(page));
      pages = pages.join(',');
    }
    let products = this.formItem.get('Products')?.value?.map(m => this.commonService.getObjectId(m)) || [];
    let productGroups = this.formItem.get('ProductGroups')?.value?.map(m => this.commonService.getObjectId(m)) || [];
    const dateRange: Date[] = this.formItem.get('DateRange').value;
    const fromDate = dateRange && dateRange[0] && (new Date(dateRange[0].getFullYear(), dateRange[0].getMonth(), dateRange[0].getDate(), 0, 0, 0, 0)).toISOString() || null;
    const toDate = dateRange && dateRange[1] && new Date(dateRange[1].getFullYear(), dateRange[1].getMonth(), dateRange[1].getDate(), 23, 59, 59, 999).toISOString() || null;

    const extendproductsQuery = {
      ...(products.length > 0 ? { eq_Product: `[${products.join(',')}]` } : {}),
      ...(productGroups.length > 0 ? { eq_ProductGroup: `[${productGroups.join(',')}]` } : {}),
    }

    this.apiService.getPromise<any[]>('/accounting/reports', {
      reportSummary: true,
      eq_Accounts: "511,512,515,521,632,635,642,641,623,131,331",
      skipHeader: true,
      branch: pages,
      toDate: toDate,
      fromDate: fromDate,
      // entryGroup: 'COMMERCEPOS',
      limit: 'nolimit',
      ...extendproductsQuery
    }).then(summaryReport => {
      console.log(summaryReport);


      this.summaryReport = {
        Cash: 0,
        // HeadCash: 0,
        CashInBank: 0,
        Revenues: 0,
        DecreaseRevenues: 0,
        DecreaseRevenuesByReturns: 0,
        DecreaseRevenuesByDiscount: 0,
        CostOfGoodsSold: 0,
        Cost: 0,
        CustomerReceivableDebt: 0,
      };
      for (const reportItem of summaryReport) {
        if (/^111/.test(reportItem.Account)) this.summaryReport.Cash += (reportItem.GenerateDebit - reportItem.GenerateCredit);
        if (/^112/.test(reportItem.Account)) this.summaryReport.CashInBank += (reportItem.GenerateDebit - reportItem.GenerateCredit);
        if (/^511|512|515/.test(reportItem.Account)) {
          this.summaryReport.Revenues += (reportItem.GenerateCredit - reportItem.GenerateDebit);
        }
        if (/^521/.test(reportItem.Account)) {
          this.summaryReport.DecreaseRevenues += (reportItem.GenerateDebit - reportItem.GenerateCredit);
        }
        if (/^5212/.test(reportItem.Account)) {
          this.summaryReport.DecreaseRevenuesByReturns += (reportItem.GenerateDebit - reportItem.GenerateCredit);
        }
        if (/^5213/.test(reportItem.Account)) {
          this.summaryReport.DecreaseRevenuesByDiscount += (reportItem.GenerateDebit - reportItem.GenerateCredit);
        }
        if (/^632/.test(reportItem.Account)) {
          this.summaryReport.CostOfGoodsSold += (reportItem.GenerateDebit - reportItem.GenerateCredit);
        }
        if (/^642|635|623|641/.test(reportItem.Account)) {
          this.summaryReport.Cost += reportItem.GenerateDebit;
        }
        if (/^131/.test(reportItem.Account)) this.summaryReport.CustomerReceivableDebt += reportItem.TailAmount;
      }
      this.summaryReport.Profit = this.summaryReport.Revenues - this.summaryReport.CostOfGoodsSold - this.summaryReport.DecreaseRevenues - this.summaryReport.Cost;
    });
    this.apiService.getPromise<any>('/accounting/reports', { reportNetRevenusFromEmployee: true, branch: pages, fromDate: fromDate, toDate: toDate, sort_CreditGenerate: 'desc', limit: 100, ...extendproductsQuery }).then(rs => {
      this.topEmployeeList = rs;
      console.log(rs);
    });
    this.apiService.getPromise<any>('/accounting/reports', { reportNetRevenusFromCustomer: true, branch: pages, fromDate: fromDate, toDate: toDate, sort_CreditGenerate: 'desc', limit: 100, ...extendproductsQuery }).then(rs => {
      this.topCustomerList = rs;
      console.log(rs);
    });
    this.apiService.getPromise<any>('/accounting/reports', { reportNetRevenusFromGoods: true, branch: pages, fromDate: fromDate, toDate: toDate, sort_CreditGenerate: 'desc', limit: 100, ...extendproductsQuery }).then(rs => {
      this.topGoodsList = rs;
      console.log(rs);
    });

    let pointRadius: number = 1;
    if (reportType == 'MONTH') {
      pointRadius = 3;
    }

    if (reportType == 'DAY') {
      pointRadius = 2;
    }

    let line1Data: any[], line2Data: any[], line3Data: any[], line4Data: any[], line5Data: any[], labels: any[], timeline: any[], mergeData: any[];

    /** Load data */
    let revenueStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[511,512,515,5213,5212]", statisticsRevenue: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', ...extendproductsQuery });
    let costStatistics632 = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[632]", statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', ...extendproductsQuery });

    /** Prepare data */
    line1Data = revenueStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfCredit - statistic.SumOfDebit; return statistic; });
    line2Data = costStatistics632.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfDebit - statistic.SumOfCredit; return statistic; });
    timeline = [...new Set([
      ...line1Data.map(item => item['Timeline']),
      ...line2Data.map(item => item['Timeline']),
    ].sort())];
    labels = [];
    mergeData = timeline.map(t => {
      const point1 = line1Data.find(f => f.Timeline == t);
      const point2 = line2Data.find(f => f.Timeline == t);
      labels.push(point1?.Label || point2?.Label);
      return {
        Label: t,
        Line1: point1 || { Value: 0 },
        Line2: point2 || { Value: 0 },
      };
    });


    this.costAndRevenueStatisticsData = {
      labels: labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: mergeData.map(point => point.Line1['Value']),
          borderColor: this.colors.success,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.success, 1),
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
        {
          label: 'Giá vốn',
          data: mergeData.map(point => point.Line2['Value']),
          borderColor: this.colors.danger,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 1),
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
      ],
    };

    const customerReceivableStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[131]", increment: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', ...extendproductsQuery });

    /** Prepare data */
    line1Data = customerReceivableStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfDebit - statistic.SumOfCredit; return statistic; });
    timeline = [
      ...new Set([
        ...line1Data.map(item => item['Timeline']),
      ].sort())
    ];
    labels = [];
    mergeData = timeline.map(t => {
      const point1 = line1Data.find(f => f.Timeline == t);
      labels.push(point1?.Label);
      return {
        Label: t,
        Line1: point1 || { Value: 0 },
      };
    });

    this.debtStatisticsData = {
      labels,
      datasets: [
        {
          label: 'Công nợ phải thu',
          // data: customerReceivableStatistics.map(statistic => statistic.SumOfDebit - statistic.SumOfCredit),
          data: mergeData.map(point => point.Line1['Value']),
          borderColor: this.colors.success,
          // backgroundColor: colors.danger,
          // backgroundColor: NbColorHelper.hexToRgbA(this.colors.success, 0.3),
          // fill: true,
          // borderDash: [5, 5],
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
      ],
    };

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
