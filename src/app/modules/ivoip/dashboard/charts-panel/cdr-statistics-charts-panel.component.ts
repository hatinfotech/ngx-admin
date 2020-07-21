import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { OrdersChartComponent } from './charts/orders-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from '../../../../@core/data/orders-chart';
import { ProfitChart } from '../../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../../@core/data/orders-profit-chart';
import { NbDialogService } from '@nebular/theme';
import { PbxFormComponent } from '../../pbx/pbx-form/pbx-form.component';
import { ApiService } from '../../../../services/api.service';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { IvoipService, PbxDomainSelection } from '../../ivoip-service';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ActionControl } from '../../../../lib/custom-element/action-control-list/action-control.interface';

@Component({
  selector: 'ngx-cdr-statistics-charts-panel',
  styleUrls: ['./cdr-statistics-charts-panel.component.scss'],
  templateUrl: './cdr-statistics-charts-panel.component.html',
})
export class CdrStatisticsChartsPanelComponent implements OnInit, OnDestroy {

  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = 'week';
  ordersChartData: OrdersChart = {
    chartLabel: [],
    linesData: [[], [], []],
  };
  profitChartData: ProfitChart;


  @ViewChild('ordersChart', { static: true }) ordersChart: OrdersChartComponent;
  @ViewChild('profitChart', { static: true }) profitChart: ProfitChartComponent;

  domainList: PbxDomainSelection[] = [];
  select2OptionForDoaminList = this.ivoipService.getDomainListOption();
  activePbxDoamin: string;

  actionButtonList: ActionControl[];
  // actionButtonList: ActionControl[] = [
  //   {
  //     type: 'select2',
  //     name: 'pbxdomain',
  //     status: 'success',
  //     label: 'Tạo',
  //     icon: 'plus',
  //     title: this.commonService.textTransform(this.commonService.translate.instant('Common.createNew'), 'head-title'),
  //     size: 'medium',
  //     select2: { data: this.domainList, option: this.select2OptionForDoaminList },
  //     value: () => this.ivoipService.activeDomainUuid,
  //     change: (value: any, option: any) => {
  //       this.onChangeDomain(value);
  //     },
  //     disabled: () => {
  //       return false;
  //     },
  //     click: () => {
  //       return false;
  //     },
  //   },
  //   {
  //     name: 'refresh',
  //     status: 'success',
  //     // label: 'Refresh',
  //     icon: 'sync',
  //     title: this.commonService.textTransform(this.commonService.translate.instant('Common.refresh'), 'head-title'),
  //     size: 'medium',
  //     disabled: () => {
  //       return false;
  //     },
  //     click: () => {
  //       this.refresh();
  //       return false;
  //     },
  //   },
  // ];

  constructor(
    public ordersProfitChartService: OrdersProfitChartData,
    public dialogService: NbDialogService,
    public apiService: ApiService,
    public ivoipService: IvoipService,
    public commonService: CommonService,
    public router: Router,
  ) {
    this.ordersProfitChartService.getOrderProfitChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe((summary) => {
        this.chartPanelSummary = summary;
      });

    this.getOrdersChartData(this.period);
    // this.getProfitChartData(this.period);
  }

  ngOnInit() {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();

      this.actionButtonList = [
        {
          type: 'select2',
          name: 'pbxdomain',
          status: 'success',
          label: 'Tạo',
          icon: 'plus',
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.createNew'), 'head-title'),
          size: 'medium',
          select2: { data: this.domainList, option: this.select2OptionForDoaminList },
          value: () => this.ivoipService.activeDomainUuid,
          change: (value: any, option: any) => {
            this.onChangeDomain(value);
          },
          disabled: () => {
            return false;
          },
          click: () => {
            return false;
          },
        },
        {
          name: 'refresh',
          status: 'success',
          // label: 'Refresh',
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


  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    // this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Profit') {
      this.profitChart.resizeChart();
    } else {
      this.ordersChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {

    const orderChartTmp: OrdersChart = {
      chartLabel: [],
      linesData: [[], [], []],
    };

    this.apiService.get<{ Label: string, Count: { Complete: number, Miss: number }, Duration: { Complete: number, Miss: number } }[]>(
      '/ivoip/cdrs', { limit: 99999999999, statistics: period, domainId: this.ivoipService.getPbxActiveDomainUuid() },
      result => {
        result.forEach(element => {
          orderChartTmp.chartLabel.push(element.Label);
          orderChartTmp.linesData[2].push(element.Count.Complete);
          orderChartTmp.linesData[1].push(element.Count.Miss);
          orderChartTmp.linesData[0].push(element.Count.Miss + element.Count.Complete);
        });
        this.ordersChartData = orderChartTmp;
      });



    // this.ordersProfitChartService.getOrdersChartData(period)
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe(ordersChartData => {
    //     this.ordersChartData = ordersChartData;
    //   });
  }

  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }

  refresh(): false {
    this.commonService.takeUntil('ivoip_dashboard_refresh', 1000, () => {
      this.ivoipService.loadDomainList(domains => {
        this.domainList = domains;
        this.activePbxDoamin = this.ivoipService.getPbxActiveDomainUuid();
        this.getOrdersChartData(this.period);
      });
    });
    return false;
  }

  onSettingClick(): false {
    this.commonService.openDialog(PbxFormComponent, {
      // context: {
      //   onSave: () => {

      //   },
      // },
    });
    return false;
  }

  onChangeDomain(event: PbxDomainModel) {
    // console.info(event);
    if (event && event['id']) {
      // this.ivoipService.setPbxActiveDomain(event['id']);
      this.ivoipService.onChangeDomain(event['id']);
      this.activePbxDoamin = event['id'];
      this.refresh();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
