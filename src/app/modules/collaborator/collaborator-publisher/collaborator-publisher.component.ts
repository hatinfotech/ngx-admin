import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseComponent } from '../../../lib/base-component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-collaborator-publisher',
  templateUrl: './collaborator-publisher.component.html',
  styleUrls: ['./collaborator-publisher.component.scss']
})
export class CollaboratorPublisherComponent extends BaseComponent {
  componentName = 'CollaboratorPublisherComponent';

  tabs: any[];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<CollaboratorPublisherComponent>,
  ) {
    super(commonService, router, apiService, ref);
  }

  async init() {
    await this.commonService.waitForLanguageLoaded();
    this.tabs = [
      {
        // title: this.commonService.translateText('Summary'),
        title: 'Summary',
        route: '/collaborator/publisher/summary',
        icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: 'Business',
        route: '/collaborator/publisher/page/list',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: 'Product',
        route: '/collaborator/publisher/product/list',
        // icon: 'pie-chart',
      },
      {
        title: 'Order',
        route: '/collaborator/publisher/order/list',
        // icon: 'pie-chart',
      },
      {
        title: 'Report',
        route: '/collaborator/publisher/report',
        // icon: 'pie-chart',
      },
    ];
    return super.init();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
