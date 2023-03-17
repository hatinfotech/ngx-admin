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
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<CollaboratorPageComponent>,
  ) {
    super(cms, router, apiService, ref);
  }

  async init() {
    await this.cms.waitForReady();
    this.tabs = [
      {
        title: this.cms.translateText('Common.summary'),
        route: '/collaborator/page/dashboard',
        icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.cms.translateText('Collaborator.Publisher.label'),
        route: '/collaborator/page/publisher/list',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.cms.translateText('Collaborator.Product.label'),
        route: '/collaborator/page/product/list',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Collaborator.Order.label'),
        route: '/collaborator/page/order/list',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Collaborator.Commission.label'),
        route: '/collaborator/page/commission/list',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Collaborator.Award.label'),
        route: '/collaborator/page/award/list',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Collaborator.PaymentCommission.paymentLabel'),
        route: '/collaborator/page/commission-payment/list',
        // icon: 'pie-chart',
      },
    ];
    return super.init();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
