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
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<CollaboratorPublisherComponent>,
  ) {
    super(cms, router, apiService, ref);
  }

  async init() {
    await this.cms.waitForReady();
    this.tabs = [
      {
        title: this.cms.translateText('Common.summary'),
        route: '/collaborator/publisher/dashboard',
        icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.cms.translateText('Collaborator.Page.label'),
        route: '/collaborator/publisher/subscription-page/list',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.cms.translateText('Collaborator.Product.label'),
        route: '/collaborator/publisher/product/list',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Collaborator.Order.label'),
        route: '/collaborator/publisher/order/list',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Collaborator.Commission.label'),
        route: '/collaborator/publisher/commission/list',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Collaborator.Award.label'),
        route: '/collaborator/publisher/award/list',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Collaborator.PaymentCommission.paymentLabel'),
        route: '/collaborator/publisher/commission-payment/list',
        // icon: 'pie-chart',
      },
    ];
    return super.init();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
