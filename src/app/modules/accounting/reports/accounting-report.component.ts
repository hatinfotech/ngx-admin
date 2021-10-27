import { takeUntil, filter } from 'rxjs/operators';
import { AccountingService } from './../accounting.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseComponent } from '../../../lib/base-component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-accounting-report',
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss']
})
export class AccountingReportComponent extends BaseComponent {
  componentName = 'AccountingReportComponent';

  tabs: any[];
  formItem: FormGroup;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<AccountingReportComponent>,
    public accountingService?: AccountingService,
    public formBuilder?: FormBuilder,
  ) {
    super(commonService, router, apiService, ref);

    this.formItem = this.formBuilder.group({
      GlobalAccField1: [],
      GlobalAccField2: [],
      GlobalAccField3: [],
      ToDate: [new Date()],
    });
    this.formItem.get('ToDate').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      console.log(value);
      this.accountingService.reportToDate$.next(value);
    });
  }

  async init() {
    await this.commonService.waitForReady();
    this.tabs = [
      {
        title: this.commonService.translateText('Accounting.SummaryReport.label'),
        route: '/accounting/report/summary',
        icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.commonService.translateText('Accounting.LiabilitiesReport.label'),
        route: '/accounting/report/liabilities',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.commonService.translateText('Accounting.ReceivablesFromCustomersReport.label'),
        route: '/accounting/report/receivables-from-customers-report',
        // icon: 'pie-chart',
      },
      {
        title: this.commonService.translateText('Accounting.ReceivablesFromEmployeeReport.label'),
        route: '/accounting/report/receivables-from-employee-report',
        // icon: 'pie-chart',
      },
      {
        title: this.commonService.translateText('Accounting.ProfitReport.label'),
        route: '/accounting/report/profit-report',
        // icon: 'pie-chart',
      },
      // {
      //   title: 'Users',
      //   icon: 'person',
      //   route: './tab1',
      // },
      // {
      //   title: 'Orders',
      //   icon: 'paper-plane-outline',
      //   responsive: true,
      //   route: [ './tab2' ],
      // },
      // {
      //   title: 'Transaction',
      //   icon: 'flash-outline',
      //   responsive: true,
      //   disabled: true,
      // },
    ];
    return super.init();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
