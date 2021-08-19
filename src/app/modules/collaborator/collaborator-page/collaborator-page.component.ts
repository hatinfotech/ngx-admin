import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseComponent } from '../../../lib/base-component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-collaborator-page',
  templateUrl: './collaborator-page.component.html',
  styleUrls: ['./collaborator-page.component.scss']
})
export class CollaboratorPageComponent extends BaseComponent {
  componentName = 'CollaboratorPageComponent';

  tabs: any[];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<CollaboratorPageComponent>,
  ) {
    super(commonService, router, apiService, ref);
  }

  async init() {
    await this.commonService.waitForLanguageLoaded();
    this.tabs = [
      {
        // title: this.commonService.translateText('Summary'),
        title: 'Summary',
        route: '/collaborator/page/summary',
        icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: 'Publisher',
        route: '/collaborator/page/publisher/list',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: 'Product',
        route: '/collaborator/page/product/list',
        // icon: 'pie-chart',
      },
      {
        title: 'Order',
        route: '/collaborator/page/order/list',
        // icon: 'pie-chart',
      },
      {
        title: 'Report',
        route: '/collaborator/page/report',
        // icon: 'pie-chart',
      },
    ];
    return super.init();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
