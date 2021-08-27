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
        title: this.commonService.translateText('Common.summary'),
        route: '/collaborator/publisher/dashboard',
        icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.commonService.translateText('Collaborator.Page.label'),
        route: '/collaborator/publisher/subscription-page/list',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.commonService.translateText('Collaborator.Product.label'),
        route: '/collaborator/publisher/product/list',
        // icon: 'pie-chart',
      },
      {
        title: this.commonService.translateText('Collaborator.Order.label'),
        route: '/collaborator/publisher/order/list',
        // icon: 'pie-chart',
      },
      // {
      //   title: this.commonService.translateText('Common.report'),
      //   route: '/collaborator/publisher/report',
      //   // icon: 'pie-chart',
      // },
    ];
    return super.init();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
