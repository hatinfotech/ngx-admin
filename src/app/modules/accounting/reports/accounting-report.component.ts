import { takeUntil, filter } from 'rxjs/operators';
import { AccountingService } from './../accounting.service';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseComponent } from '../../../lib/base-component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { RootServices } from '../../../services/root.services';

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
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<AccountingReportComponent>,
    public accountingService?: AccountingService,
    public formBuilder?: FormBuilder,
  ) {
    super(rsv, cms, router, apiService, ref);

    const reportFromDate = localStorage.getItem('Accounting.ReportFromDate');
    const reportToDate = localStorage.getItem('Accounting.ReportToDate');
    this.formItem = this.formBuilder.group({
      GlobalAccField1: [],
      GlobalAccField2: [],
      GlobalAccField3: [],
      FromDate: [reportToDate ? new Date(parseInt(reportFromDate)) : new Date()],
      ToDate: [reportToDate ? new Date(parseInt(reportToDate)) : new Date(), (control: FormControl) => {
        // console.log(control);
        if (control.value) {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          const controlValue = new Date(control.value.getTime());
          controlValue.setHours(0, 0, 0, 0);
          if (controlValue.getTime() < currentDate.getTime()) {
            return { invalidName: true, required: true, text: 'trước ngày hiện tại' };
          }
        }
        return null;
      }],
    });
    const fromDateFormConttol = this.formItem.get('FromDate');
    const toDateFormConttol = this.formItem.get('ToDate');

    fromDateFormConttol.valueChanges.pipe(takeUntil(this.destroy$), filter(f => !this.accountingService.reportFromDate$?.value || (f as Date).getTime() != this.accountingService.reportFromDate$?.value.getTime())).subscribe((value: Date) => {
      console.log(value);
      this.accountingService.reportFromDate$.next(value);
      // const currentDate = new Date();
    });

    this.accountingService.reportFromDate$.pipe(takeUntil(this.destroy$), filter(f => f !== null)).subscribe(reportFromDate => {
      fromDateFormConttol.setValue(reportFromDate);
    });


    toDateFormConttol.valueChanges.pipe(takeUntil(this.destroy$), filter(f => !this.accountingService.reportToDate$?.value || (f as Date).getTime() != this.accountingService.reportToDate$?.value.getTime())).subscribe((value: Date) => {
      console.log(value);
      this.accountingService.reportToDate$.next(value);
      // const currentDate = new Date();
    });

    this.accountingService.reportToDate$.pipe(takeUntil(this.destroy$), filter(f => f !== null)).subscribe(reportToDate => {
      toDateFormConttol.setValue(reportToDate);
    });
  }

  async init() {
    await this.cms.waitForReady();
    this.tabs = [
      {
        title: this.cms.translateText('Accounting.SummaryReport.label'),
        route: '/accounting/report/summary',
        icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.cms.translateText('Lưu chuyển tiền tệ'),
        route: '/accounting/report/contra-account',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.cms.translateText('Đối soát công nợ'),
        route: '/accounting/report/cash-flow',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.cms.translateText('Accounting.LiabilitiesReport.label'),
        route: '/accounting/report/liabilities',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.cms.translateText('Accounting.ReceivablesFromCustomersReport.label'),
        route: '/accounting/report/receivables-from-customers-report',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Accounting.ReceivablesFromEmployeeReport.label'),
        route: '/accounting/report/receivables-from-employee-report',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Góp vốn'),
        route: '/accounting/report/contributed-capital-report',
        // icon: 'pie-chart',
      },
      {
        title: this.cms.translateText('Accounting.ProfitReport.label'),
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
