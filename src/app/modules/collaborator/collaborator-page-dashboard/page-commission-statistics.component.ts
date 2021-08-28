import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService, NbColorHelper } from '@nebular/theme';

@Component({
  selector: 'ngx-page-commission-statistics',
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class PageCommissionStatisticsComponent implements OnDestroy {
  @Input() data: {};
  @Input() options: any;
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    public apiService: ApiService,
    public commonService: CommonService,
  ) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      if (false) setTimeout(() => {
        this.data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [{
            label: 'dataset - big points',
            data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
            borderColor: colors.primary,
            backgroundColor: colors.primary,
            fill: false,
            borderDash: [5, 5],
            pointRadius: 8,
            pointHoverRadius: 10,
          }, {
            label: 'dataset - individual point sizes',
            data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
            borderColor: colors.dangerLight,
            backgroundColor: colors.dangerLight,
            fill: false,
            borderDash: [5, 5],
            pointRadius: 8,
            pointHoverRadius: 10,
          }, {
            label: 'dataset - large pointHoverRadius',
            data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
            borderColor: colors.info,
            backgroundColor: colors.info,
            fill: false,
            pointRadius: 8,
            pointHoverRadius: 10,
          }, {
            label: 'dataset - large pointHitRadius',
            data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
            borderColor: colors.success,
            backgroundColor: colors.success,
            fill: false,
            pointRadius: 8,
            pointHoverRadius: 10,
          }],
        };
      }, 10000);

      
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  private random() {
    return Math.round(Math.random() * 100);
  }
}
