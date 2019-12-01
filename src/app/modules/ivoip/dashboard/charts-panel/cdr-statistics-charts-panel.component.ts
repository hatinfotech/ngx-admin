import { Component, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { OrdersChartComponent } from './charts/orders-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from '../../../../@core/data/orders-chart';
import { ProfitChart } from '../../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../../@core/data/orders-profit-chart';
import { NbDialogService } from '@nebular/theme';
import { PbxFormComponent } from '../../pbx/pbx-form/pbx-form.component';

@Component({
  selector: 'ngx-cdr-statistics-charts-panel',
  styleUrls: ['./cdr-statistics-charts-panel.component.scss'],
  templateUrl: './cdr-statistics-charts-panel.component.html',
})
export class CdrStatisticsChartsPanelComponent implements OnDestroy {

  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = 'week';
  ordersChartData: OrdersChart;
  profitChartData: ProfitChart;

  @ViewChild('ordersChart', { static: true }) ordersChart: OrdersChartComponent;
  @ViewChild('profitChart', { static: true }) profitChart: ProfitChartComponent;

  constructor(
    private ordersProfitChartService: OrdersProfitChartData,
    private dialogService: NbDialogService,
  ) {
    this.ordersProfitChartService.getOrderProfitChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe((summary) => {
        this.chartPanelSummary = summary;
      });

    this.getOrdersChartData(this.period);
    this.getProfitChartData(this.period);
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Profit') {
      this.profitChart.resizeChart();
    } else {
      this.ordersChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {
    this.ordersProfitChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });
  }

  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }

  refresh(): false {
    return false;
  }

  onSettingClick(): false {
    this.dialogService.open(PbxFormComponent, {
      // context: {
      //   onSave: () => {

      //   },
      // },
    });
    return false;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
