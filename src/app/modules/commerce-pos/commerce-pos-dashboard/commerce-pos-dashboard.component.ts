import { CurrencyPipe } from '@angular/common';
import { ProductGroupModel } from '../../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../../@core/data/solar';
import { ApiService } from '../../../services/api.service';
import { Icon } from '../../../lib/custom-element/card-header/card-header.component';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
import { PageModel } from '../../../models/page.model';
import { CommercePosService } from '../commerce-pos.service';
import { from } from 'rxjs';
import { lab } from 'd3-color';
import { AccMasterBookModel } from '../../../models/accounting.model';
interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}
@Component({
  selector: 'ngx-commerce-pos-dashboard',
  templateUrl: './commerce-pos-dashboard.component.html',
  styleUrls: ['./commerce-pos-dashboard.component.scss'],
  providers: [CurrencyPipe]
})
export class CommercePosDashboardComponent implements OnDestroy {

  groupList: ProductGroupModel[];
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
    public accountingService: CommercePosService,
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

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });

    // const currentDate = new Date();
    this.formItem = this.formBuilder.group({
      DateReport: { disabled: true, value: 'HOUR' },
      DateRange: [this.dateReportList.find(f => f.id === 'HOUR').range],
      Page: [[]],
      ProductGroup: { value: '', disabled: true },
    });
    this.formItem.get('DateReport').valueChanges.subscribe(value => {
      console.log(value);
      this.formItem.get('DateRange').setValue(this.dateReportList.find(f => f.id === this.commonService.getObjectId(value)).range);
    });

    setTimeout(() => {
      this.refresh();
    }, 1000);
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
          { id: 'DAY', text: 'Phân tích theo ngày', range: [new Date(previousMonth.getFullYear(), previousMonth.getMonth(), previousMonth.getDate(), 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), current.getDate(), current.getHours(), current.getMinutes(), current.getSeconds(), current.getMilliseconds())] },
          { id: 'MONTH', text: 'Phân tích theo tháng', range: [new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()), new Date(new Date().getFullYear(), 11, 31)] },
          { id: 'DAYOFWEEK', text: 'Phân tích theo tuần', range: [this.getUpcomingMonday(), this.getUpcomingSunday()] },
          { id: 'HOUR', text: 'Phân tích theo giờ', range: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)] },
        ];
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
    const dateRange: Date[] = this.formItem.get('DateRange').value;
    const fromDate = dateRange && dateRange[0] && (new Date(dateRange[0].getFullYear(), dateRange[0].getMonth(), dateRange[0].getDate(), 0, 0, 0, 0)).toISOString() || null;
    const toDate = dateRange && dateRange[1] && new Date(dateRange[1].getFullYear(), dateRange[1].getMonth(), dateRange[1].getDate(), 23, 59, 59, 999).toISOString() || null;

    this.apiService.getPromise<any[]>('/accounting/reports', {
      reportSummary: true,
      eq_Accounts: "111,112,511,512,515,521,632,635,642,641,623,131,331",
      skipHeader: true,
      branch: pages,
      toDate: toDate,
      fromDate: fromDate,
      entryGroup: 'COMMERCEPOS',
      limit: 'nolimit'
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
        // if (/^112/.test(reportItem.Account)) this.summaryReport.HeadCashInBank += reportItem.HeadAmount;
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
        if (/^131/.test(reportItem.Account)) this.summaryReport.CustomerReceivableDebt += (reportItem.GenerateDebit - reportItem.GenerateCredit);
        // if (/^131/.test(reportItem.Account)) this.summaryReport.CustomerReceivableHeadDebt += reportItem.HeadAmount;
      }

      // this.summaryReport = {
      //   Cash: summaryReport.filter(f => /^111/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.GenerateDebit), 0),
      //   CashInBank: summaryReport.filter(f => /^112/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.GenerateDebit), 0),
      //   Revenues: summaryReport.filter(f => /^511|512|515|711/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.GenerateCredit), 0),
      //   DecreaseRevenues: summaryReport.filter(f => /^521/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.GenerateDebit), 0),
      //   CostOfGoodsSold: summaryReport.filter(f => /^632/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.GenerateDebit), 0),
      //   Cost: summaryReport.filter(f => /^642|635|623|641|811/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.GenerateDebit), 0),
      //   CustomerReceivableDebt: summaryReport.filter(f => /^131/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.GenerateDebit), 0),
      //   // LiabilitiesDebt: summaryReport.filter(f => /^331/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.GenerateCredit), 0),
      //   // Profit: summaryReport.filter(f => /^4212/.test(f.Account)).reduce((sum, current) => sum + parseFloat(current.TailCredit), 0),
      // };
      this.summaryReport.Profit = this.summaryReport.Revenues - this.summaryReport.CostOfGoodsSold - this.summaryReport.DecreaseRevenues - this.summaryReport.Cost;
    });
    this.apiService.getPromise<any>('/accounting/reports', { reportNetRevenusFromEmployee: true, branch: pages, toDate: toDate, sort_TailCredit: 'desc', limit: 100 }).then(rs => {
      this.topEmployeeList = rs;
      console.log(rs);
    });
    this.apiService.getPromise<any>('/accounting/reports', { reportNetRevenusFromCustomer: true, branch: pages, toDate: toDate, sort_TailCredit: 'desc', limit: 100 }).then(rs => {
      this.topCustomerList = rs;
      console.log(rs);
    });
    this.apiService.getPromise<any>('/accounting/reports', { reportNetRevenusFromGoods: true, branch: pages, toDate: toDate, sort_TailCredit: 'desc', limit: 100 }).then(rs => {
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
    let revenueStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[511,512,515,711]", statisticsRevenue: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // let costStatistics632 = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[632]", statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // let costStatistics641 = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[641,642,811]", statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    let costStatistics632 = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[5213]", statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    let costStatistics641 = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[5212]", statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });

    /** Prepare data */
    line1Data = revenueStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfCredit - statistic.SumOfDebit; return statistic; });
    line2Data = costStatistics632.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfDebit - statistic.SumOfCredit; return statistic; });
    line3Data = costStatistics641.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfDebit - statistic.SumOfCredit; return statistic; });
    timeline = [...new Set([
      ...line1Data.map(item => item['Timeline']),
      ...line2Data.map(item => item['Timeline']),
      ...line3Data.map(item => item['Timeline']),
    ].sort())];
    labels = [];
    mergeData = timeline.map(t => {
      const point1 = line1Data.find(f => f.Timeline == t);
      const point2 = line2Data.find(f => f.Timeline == t);
      const point3 = line3Data.find(f => f.Timeline == t);
      labels.push(point1?.Label || point2?.Label);
      // labels.push(point1?.Label);
      return {
        Label: t,
        Line1: point1 || { Value: 0 },
        Line2: point2 || { Value: 0 },
        Line3: point3 || { Value: 0 },
      };
    });


    this.costAndRevenueStatisticsData = {
      labels: labels,
      datasets: [
        {
          label: 'Doanh số',
          data: mergeData.map(point => point.Line1['Value']),
          borderColor: this.colors.success,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.success, 1),
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
        // {
        //   label: 'Giá vốn',
        //   data: mergeData.map(point => point.Line2['Value']),
        //   borderColor: this.colors.danger,
        //   backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 1),
        //   pointRadius: pointRadius,
        //   pointHoverRadius: 10,
        // },
        // {
        //   label: 'Chi phí',
        //   data: mergeData.map(point => point.Line3['Value']),
        //   borderColor: this.colors.warning,
        //   backgroundColor: NbColorHelper.hexToRgbA(this.colors.warning, 1),
        //   pointRadius: pointRadius,
        //   pointHoverRadius: 10,
        // },
        {
          label: 'Giảm giá',
          data: mergeData.map(point => point.Line2['Value']),
          borderColor: this.colors.danger,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 1),
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
        {
          label: 'Trả hàng',
          data: mergeData.map(point => point.Line3['Value']),
          borderColor: this.colors.warning,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.warning, 1),
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
      ],
    };

    const _cashFlowStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[1111]", increment: false, statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // const cashFlowStatisticsData = [];
    const cashFlowStatistics = [];
    let previusPoint = null;
    for (let i = 0; i < 24; i++) {
      let point = _cashFlowStatistics.find(f => f.Hour == i);
      if (point) {
        point.Data = point.SumOfDebit - point.SumOfCredit;
        if (previusPoint) {
          point.Data += previusPoint.Data;
        }
        previusPoint = point;
      } else {
        point = {
          Data: previusPoint && previusPoint.Data || 0,
          Hour: i
        };
      }
      cashFlowStatistics.push(point);
    }
    const cashInBankFlowStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[1121]", increment: true, statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // const goldFlowStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[1113]", increment: true, statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // const voucherFlowStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[1114]", increment: true, statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });

    /** Prepare data */
    // line1Data = voucherFlowStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfDebit - statistic.SumOfCredit; return statistic; });
    // line2Data = goldFlowStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfDebit - statistic.SumOfCredit; return statistic; });
    line3Data = cashInBankFlowStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfDebit - statistic.SumOfCredit; return statistic; });
    line4Data = cashFlowStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.Data; return statistic; });
    timeline = [...new Set([
      // ...line1Data.map(item => item['Timeline']),
      // ...line2Data.map(item => item['Timeline']),
      ...line3Data.map(item => item['Timeline']),
      ...line4Data.map(item => item['Timeline']),
    ].sort())];
    labels = [];
    mergeData = timeline.map(t => {
      // const point1 = line1Data.find(f => f.Timeline == t);
      // const point2 = line2Data.find(f => f.Timeline == t);
      const point3 = line3Data.find(f => f.Timeline == t);
      const point4 = line4Data.find(f => f.Timeline == t);
      // labels.push(point1?.Label || point2?.Label || point3?.Label || point4?.Label);
      labels.push(point3?.Label || point4?.Label);
      return {
        Label: t,
        // Line1: point1 || { Value: 0 },
        // Line2: point2 || { Value: 0 },
        Line3: point3 || { Value: 0 },
        Line4: point4 || { Value: 0 },
      };
    });


    this.cashFlowStatisticsData = {
      labels: labels,
      datasets: [
        // {
        //   label: 'Voucher',
        //   // data: voucherFlowStatistics.map(statistic => statistic.SumOfDebit - statistic.SumOfCredit),
        //   data: mergeData.map(point => point.Line1['Value']),
        //   borderColor: this.colors.primary,
        //   // backgroundColor: colors.danger,
        //   backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.1),
        //   // fill: true,
        //   // borderDash: [5, 5],
        //   pointRadius: pointRadius,
        //   pointHoverRadius: 10,
        // },
        // {
        //   label: 'Vàng',
        //   // data: goldFlowStatistics.map(statistic => statistic.SumOfDebit - statistic.SumOfCredit),
        //   data: mergeData.map(point => point.Line2['Value']),
        //   borderColor: this.colors.warning,
        //   // backgroundColor: colors.danger,
        //   backgroundColor: NbColorHelper.hexToRgbA(this.colors.warning, 0.1),
        //   // fill: true,
        //   // borderDash: [5, 5],
        //   pointRadius: pointRadius,
        //   pointHoverRadius: 10,
        // },
        {
          label: 'Tiền trong ngân hàng',
          // data: cashInBankFlowStatistics.map(statistic => statistic.SumOfDebit - statistic.SumOfCredit),
          data: mergeData.map(point => point.Line3['Value']),
          borderColor: this.colors.info,
          // backgroundColor: colors.danger,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.info, 0.1),
          // fill: true,
          // borderDash: [5, 5],
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
        {
          label: 'Tiền mặt',
          // data: cashFlowStatistics.map(statistic => statistic.SumOfDebit - statistic.SumOfCredit),
          data: mergeData.map(point => point.Line4['Value']),
          borderColor: this.colors.success,
          // backgroundColor: colors.danger,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.success, 0.1),
          // fill: true,
          // borderDash: [5, 5],
          pointRadius: pointRadius,
          pointHoverRadius: 10,
        },
      ],
    };

    const _customerReceivableStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[131]", increment: false, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // const liabilitiesStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[331]", increment: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // const loadStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[3411]", increment: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // const financialLeasingDebtStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[3412]", increment: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });
    // const a1288Statistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[1288]", increment: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });

    const customerReceivableStatistics = [];
    previusPoint = null;
    for (let i = 0; i < 24; i++) {
      let point = _customerReceivableStatistics.find(f => f.Hour == i);
      if (point) {
        point.Data = point.SumOfDebit - point.SumOfCredit;
        if (previusPoint) {
          point.Data += previusPoint.Data;
        }
        previusPoint = point;
      } else {
        point = {
          Data: previusPoint && previusPoint.Data || 0,
          Hour: i
        };
      }
      customerReceivableStatistics.push(point);
    }

    /** Prepare data */
    line1Data = customerReceivableStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.Data; return statistic; });
    // line2Data = liabilitiesStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfCredit - statistic.SumOfDebit; return statistic; });
    // line3Data = loadStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfCredit - statistic.SumOfDebit; return statistic; });
    // line4Data = financialLeasingDebtStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfCredit - statistic.SumOfDebit; return statistic; });
    // line5Data = a1288Statistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.SumOfDebit - statistic.SumOfCredit; return statistic; });
    timeline = [
      ...new Set([
        ...line1Data.map(item => item['Timeline']),
        // ...line2Data.map(item => item['Timeline']),
        // ...line3Data.map(item => item['Timeline']),
        // ...line4Data.map(item => item['Timeline']),
        // ...line5Data.map(item => item['Timeline']),
      ].sort())
    ];
    labels = [];
    mergeData = timeline.map(t => {
      const point1 = line1Data.find(f => f.Timeline == t);
      // const point2 = line2Data.find(f => f.Timeline == t);
      // const point3 = line3Data.find(f => f.Timeline == t);
      // const point4 = line4Data.find(f => f.Timeline == t);
      // const point5 = line5Data.find(f => f.Timeline == t);
      // labels.push(point1?.Label || point2?.Label || point3?.Label || point4?.Label);
      labels.push(point1?.Label);
      return {
        Label: t,
        Line1: point1 || { Value: 0 },
        // Line2: point2 || { Value: 0 },
        // Line3: point3 || { Value: 0 },
        // Line4: point4 || { Value: 0 },
        // Line5: point5 || { Value: 0 },
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
        // {
        //   label: 'Công nợ phải trả',
        //   // data: liabilitiesStatistics.map(statistic => statistic.SumOfCredit - statistic.SumOfDebit),
        //   data: mergeData.map(point => point.Line2['Value']),
        //   borderColor: this.colors.primary,
        //   // backgroundColor: colors.primary,
        //   // backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 0.3),
        //   // fill: true,
        //   // borderDash: [5, 5],
        //   pointRadius: pointRadius,
        //   pointHoverRadius: 10,
        // },
        // {
        //   label: 'Các khoản vay',
        //   // data: loadStatistics.map(statistic => statistic.SumOfCredit - statistic.SumOfDebit),
        //   data: mergeData.map(point => point.Line3['Value']),
        //   borderColor: this.colors.warning,
        //   // backgroundColor: colors.primary,
        //   // backgroundColor: NbColorHelper.hexToRgbA(this.colors.warning, 0.3),
        //   // fill: true,
        //   borderDash: [5, 5],
        //   pointRadius: pointRadius,
        //   pointHoverRadius: 10,
        // },
        // {
        //   label: 'Nợ thuê tài chính',
        //   // data: financialLeasingDebtStatistics.map(statistic => statistic.SumOfCredit - statistic.SumOfDebit),
        //   data: mergeData.map(point => point.Line4['Value']),
        //   borderColor: this.colors.danger,
        //   // backgroundColor: colors.primary,
        //   // backgroundColor: NbColorHelper.hexToRgbA(this.colors.warning, 0.3),
        //   // fill: true,
        //   borderDash: [5, 5],
        //   pointRadius: pointRadius,
        //   pointHoverRadius: 10,
        // },
        // {
        //   label: 'Đầu tư khác',
        //   // data: financialLeasingDebtStatistics.map(statistic => statistic.SumOfCredit - statistic.SumOfDebit),
        //   data: mergeData.map(point => point.Line5['Value']),
        //   borderColor: this.colors.info,
        //   // backgroundColor: colors.primary,
        //   // backgroundColor: NbColorHelper.hexToRgbA(this.colors.warning, 0.3),
        //   // fill: true,
        //   // borderDash: [5, 5],
        //   pointRadius: pointRadius,
        //   pointHoverRadius: 10,
        // },
      ],
    };

    // const _profitStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[632,641,642,635,623,811,511,512,515,521,711]", statisticsProfit: true, increment: false, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit', entryGroup: 'COMMERCEPOS' });

    // const profitStatistics = [];
    // previusPoint = null;
    // for (let i = 0; i < 24; i++) {
    //   let point = _profitStatistics.find(f => f.Hour == i);
    //   if (point) {
    //     point.Data = point.SumOfCredit - point.SumOfDebit;
    //     if (previusPoint) {
    //       point.Data += previusPoint.Data;
    //     }
    //     previusPoint = point;
    //   } else {
    //     point = {
    //       Data: previusPoint && previusPoint.Data || 0,
    //       Hour: i
    //     };
    //   }
    //   profitStatistics.push(point);
    // }

    // /** Prepare data */
    // line1Data = profitStatistics.map(statistic => { statistic.Label = this.makeStaticLabel(statistic, reportType); statistic.Timeline = this.makeTimeline(statistic, reportType); statistic.Value = statistic.Data; return statistic; });
    // timeline = [...new Set([
    //   ...line1Data.map(item => item['Timeline']),
    // ].sort())];
    // labels = [];
    // mergeData = timeline.map(t => {
    //   const point = line1Data.find(f => f.Timeline == t);
    //   labels.push(point?.Label);
    //   return {
    //     Label: t,
    //     Line1: point || { Value: 0 },
    //   };
    // });

    // this.profitStatisticsData = {
    //   labels,
    //   datasets: [
    //     {
    //       label: 'Lợi nhuận sau thuế',
    //       // data: profitStatistics.map(statistic => statistic.SumOfCredit - statistic.SumOfDebit),
    //       data: mergeData.map(point => point.Line1['Value']),
    //       borderColor: this.colors.info,
    //       // backgroundColor: colors.danger,
    //       backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.1),
    //       // fill: true,
    //       // borderDash: [5, 5],
    //       pointRadius: pointRadius,
    //       pointHoverRadius: 10,
    //     },
    //   ],
    // };
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
