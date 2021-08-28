import { ProductGroupModel } from '../../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../../@core/data/solar';
import { CollaboratorService } from '../collaborator.service';
import { ApiService } from '../../../services/api.service';
import { CollaboratorPageModel } from '../../../models/collaborator.model';
import { Icon } from '../../../lib/custom-element/card-header/card-header.component';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}
@Component({
  selector: 'ngx-collaborator-publisher-dashboard',
  templateUrl: './collaborator-publisher-dashboard.component.html',
  styleUrls: ['./collaborator-publisher-dashboard.component.scss']
})
export class CollaboratorPublisherDashboardComponent implements OnDestroy {

  groupList: ProductGroupModel[];
  formItem: FormGroup;

  size?: string = 'medium';
  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  title?: string = 'Phát sinh doanh thu/hoa hồng';
  actionButtonList: ActionControl[];

  data: {};
  options: any;
  colors: any;
  chartjs: any;

  constructor(
    private themeService: NbThemeService,
    private solarService: SolarData,
    public commonService: CommonService,
    public formBuilder: FormBuilder,
    public collaboratorService: CollaboratorService,
    public apiService: ApiService,
  ) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];

        this.colors = theme.variables;
        this.chartjs = theme.variables.chartjs;

        // setInterval(() => {
        // this.refresh();
        // }, 5000);

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

    this.apiService.getPromise<ProductGroupModel[]>('/collaborator/product-groups', { onlyIdText: true, limit: 'nolimit' }).then(rs => {
      this.groupList = [{ id: '', text: '' }, ...rs];
    });

    // const currentDate = new Date();
    this.formItem = this.formBuilder.group({
      DateReport: ['DAY', Validators.required],
      DateRange: [this.dateReportList.find(f => f.id === 'DAY').range],
      Page: [[]],
      ProductGroup: { value: '', disabled: true },
    });
    // this.formItem.patchValue({
    //   DateReport: 'MONTH',
    //   DateRange: [new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), new Date(currentDate.getFullYear(), currentDate.getMonth(), 31)],
    //   Page: this.collaboratorService.currentpage$.value || null,
    //   ProductGroup: null,
    // });
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

    this.commonService.waitForLanguageLoaded().then(() => {
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
    placeholder: 'Tất cả trang...',
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
    allowClear: false,
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

  }

  select2ProductGroup = {
    placeholder: 'Tất cả nhóm sản phẩm...',
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

  onChangePage(page: CollaboratorPageModel) {

  }

  async refresh() {
    const reportType = this.commonService.getObjectId(this.formItem.get('DateReport').value);
    let pages = this.formItem.get('Page').value;
    if (pages) {
      pages = pages.map(page => this.commonService.getObjectId(page));
      pages = pages.join(',');
    }
    const dateRange = this.formItem.get('DateRange').value;
    const fromDate = dateRange && dateRange[0] && dateRange[0].toISOString() || null;
    const toDate = dateRange && dateRange[1] && dateRange[1].toISOString() || null;
    this.apiService.getPromise<any[]>('/collaborator/statistics', { reportTempNetRevenue: true, page: pages, reportBy: reportType, ge_DateOfOrder: fromDate, le_DateOfOrder: toDate, limit: 'nolimit' }).then(tempNetREvenues => {
      this.apiService.getPromise<any[]>('/collaborator/statistics', { page: pages, reportBy: reportType, ge_VoucherDate: fromDate, le_VoucherDate: toDate, limit: 'nolimit' }).then(rs => {
        this.data = {
          labels: reportType === 'MONTH' ? tempNetREvenues.map(statistic => statistic['Month'] + '/' + statistic['Year'])
            : (reportType === 'DAY' ? tempNetREvenues.map(statistic => statistic['Day'] + '/' + statistic['Month'])
              : (reportType === 'HOUR' ? tempNetREvenues.map(statistic => statistic['Hour']) : tempNetREvenues.map(statistic => this.dayLabel[statistic['DayOfWeek']]))),
          datasets: [
            {
              label: 'Doanh thu tạm tính',
              data: tempNetREvenues.map(statistic => parseInt(statistic.NetRevenue)),
              borderColor: this.colors.info,
              // backgroundColor: colors.danger,
              backgroundColor: NbColorHelper.hexToRgbA(this.colors.info, 0.3),
              // fill: true,
              borderDash: [5, 5],
              pointRadius: 8,
              pointHoverRadius: 10,
            },
            {
              label: 'Doanh thu đã duyệt',
              data: rs.map(statistic => parseInt(statistic.NetRevenue)),
              borderColor: this.colors.danger,
              // backgroundColor: colors.primary,
              backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 0.3),
              // fill: true,
              // borderDash: [5, 5],
              pointRadius: 8,
              pointHoverRadius: 10,
            },
            {
              label: 'Hoa hồng',
              data: rs.map(statistic => parseInt(statistic.CommissionAmount)),
              borderColor: this.colors.success,
              // backgroundColor: colors.success,
              backgroundColor: NbColorHelper.hexToRgbA(this.colors.success, 0.3),
              // fill: true,
              // borderDash: [5, 5],
              pointRadius: 8,
              pointHoverRadius: 10,
            }
          ],
        };
      });
    });
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
