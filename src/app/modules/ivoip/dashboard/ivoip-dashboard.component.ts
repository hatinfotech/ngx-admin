import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../lib/base-component';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-ivoip-dashboard',
  templateUrl: './ivoip-dashboard.component.html',
})
export class IvoipDashboardComponent extends BaseComponent implements OnInit {
  componentName: string = 'IvoipDashboardComponent';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

}
