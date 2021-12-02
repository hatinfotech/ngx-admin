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
import { AccountingService } from '../accounting.service';
interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}
@Component({
  selector: 'ngx-accounting-dashboard',
  templateUrl: './accounting-dashboard.component.html',
  styleUrls: ['./accounting-dashboard.component.scss']
})
export class AccountingDashboardComponent implements OnDestroy {

  groupList: ProductGroupModel[];
  formItem: FormGroup;

  size?: string = 'medium';
  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  title?: string = 'Phát sinh doanh thu/hoa hồng';
  actionButtonList: ActionControl[];

  costAndRevenueStatisticsData: {};
  cashFlowStatisticsData: {};
  debtStatisticsData: {};
  profitStatisticsData: {};
  orderStatisticsData: {};
  publisherRegisteredStatisticsData: {};
  options: any;
  colors: any;
  chartjs: any;

  summaryReport: {
    NumOfPage?: number,
    NumOfPublisher?: number,
    NumOfProduct?: number,
    NumOfOrder?: number,
    CommissionAmount?: number,
    CommissionPaymentAmount?: number,
    NetVenueAmount?: number,
  };

  publishers = [];
  products = [];

  constructor(
    private themeService: NbThemeService,
    private solarService: SolarData,
    public commonService: CommonService,
    public formBuilder: FormBuilder,
    public accountingService: AccountingService,
    public apiService: ApiService,
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
                  labelString: 'Month',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Value',
                },
                gridLines: {
                  display: true,
                  color: this.chartjs.axisLineColor,
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                },
              },
            ],
          },
        };
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
    this.formItem = this.formBuilder.group({
      DateReport: ['DAY', Validators.required],
      DateRange: [this.dateReportList.find(f => f.id === 'DAY').range],
      Page: [[]],
      ProductGroup: { value: '', disabled: true },
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
    { id: 'DAY', text: 'Phân tích theo tháng', range: [new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth(), 31, 23, 59, 59)] },
    { id: 'MONTH', text: 'Phân tích theo năm', range: [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)] },
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

    // this.apiService.getPromise<any>('/collaborator/statistics', { summaryReport: 'PAGE,PUBLISHER,PRODUCT,ORDER,NETVENUE', page: pages, reportBy: reportType, toDate: toDate, limit: 'nolimit' }).then(summaryReport => {
    //   this.summaryReport = summaryReport;
    //   console.log(summaryReport);
    // });

    
    const costStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[632,6421,6422,811]", statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit' });
    const revenueStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', {eq_Account: "[511,512,515]", statisticsRevenue: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit' });
    this.costAndRevenueStatisticsData = {
      labels: reportType === 'MONTH' ? costStatistics.map(statistic => statistic['Month'] + '/' + statistic['Year'])
        : (reportType === 'DAY' ? costStatistics.map(statistic => statistic['Day'] + '/' + statistic['Month'])
          : (reportType === 'HOUR' ? costStatistics.map(statistic => statistic['Hour']) : costStatistics.map(statistic => this.dayLabel[statistic['DayOfWeek']]))),
      datasets: [
        {
          label: 'Doanh thu',
          data: revenueStatistics.map(statistic => statistic.SumOfCredit - statistic.SumOfDebit),
          borderColor: this.colors.info,
          // backgroundColor: colors.danger,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.3),
          // fill: true,
          // borderDash: [5, 5],
          pointRadius: 1,
          pointHoverRadius: 10,
        },
        {
          label: 'Chi phí',
          data: costStatistics.map(statistic => statistic.SumOfDebit - statistic.SumOfCredit),
          borderColor: this.colors.danger,
          // backgroundColor: colors.primary,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 0.3),
          // fill: true,
          borderDash: [5, 5],
          pointRadius: 1,
          pointHoverRadius: 10,
        },
      ],
    };

    const cashFlowStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[1111,1121]", increment: true, statisticsCost: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit' });
    this.cashFlowStatisticsData = {
      labels: reportType === 'MONTH' ? cashFlowStatistics.map(statistic => statistic['Month'] + '/' + statistic['Year'])
        : (reportType === 'DAY' ? cashFlowStatistics.map(statistic => statistic['Day'] + '/' + statistic['Month'])
          : (reportType === 'HOUR' ? cashFlowStatistics.map(statistic => statistic['Hour']) : cashFlowStatistics.map(statistic => this.dayLabel[statistic['DayOfWeek']]))),
      datasets: [
        {
          label: 'Dòng tiền',
          data: cashFlowStatistics.map(statistic => statistic.SumOfDebit - statistic.SumOfCredit),
          borderColor: this.colors.info,
          // backgroundColor: colors.danger,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.3),
          // fill: true,
          // borderDash: [5, 5],
          pointRadius: 1,
          pointHoverRadius: 10,
        },
      ],
    };
    
    const customerReceivableStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', { eq_Account: "[131]", increment: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit' });
    const liabilitiesStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', {eq_Account: "[331]", increment: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit' });

    this.debtStatisticsData = {
      labels: reportType === 'MONTH' ? customerReceivableStatistics.map(statistic => statistic['Month'] + '/' + statistic['Year'])
        : (reportType === 'DAY' ? customerReceivableStatistics.map(statistic => statistic['Day'] + '/' + statistic['Month'])
          : (reportType === 'HOUR' ? customerReceivableStatistics.map(statistic => statistic['Hour']) : customerReceivableStatistics.map(statistic => this.dayLabel[statistic['DayOfWeek']]))),
      datasets: [
        {
          label: 'Công nợ phải thu',
          data: customerReceivableStatistics.map(statistic => statistic.SumOfDebit - statistic.SumOfCredit),
          borderColor: this.colors.info,
          // backgroundColor: colors.danger,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.3),
          // fill: true,
          // borderDash: [5, 5],
          pointRadius: 1,
          pointHoverRadius: 10,
        },
        {
          label: 'Công nợ phải trả',
          data: liabilitiesStatistics.map(statistic => statistic.SumOfCredit - statistic.SumOfDebit),
          borderColor: this.colors.danger,
          // backgroundColor: colors.primary,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 0.3),
          // fill: true,
          // borderDash: [5, 5],
          pointRadius: 1,
          pointHoverRadius: 10,
        },
      ],
    };

    const profitStatistics = await this.apiService.getPromise<any[]>('/accounting/statistics', {eq_Account: "[632,6421,6422,811,511,512,515]", statisticsProfit: true, increment: true, branch: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit' });
    this.profitStatisticsData = {
      labels: reportType === 'MONTH' ? profitStatistics.map(statistic => statistic['Month'] + '/' + statistic['Year'])
        : (reportType === 'DAY' ? profitStatistics.map(statistic => statistic['Day'] + '/' + statistic['Month'])
          : (reportType === 'HOUR' ? profitStatistics.map(statistic => statistic['Hour']) : profitStatistics.map(statistic => this.dayLabel[statistic['DayOfWeek']]))),
      datasets: [
        {
          label: 'Lợi nhuận sau thuế',
          data: profitStatistics.map(statistic => statistic.SumOfCredit - statistic.SumOfDebit),
          borderColor: this.colors.info,
          // backgroundColor: colors.danger,
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.primary, 0.3),
          // fill: true,
          // borderDash: [5, 5],
          pointRadius: 1,
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
