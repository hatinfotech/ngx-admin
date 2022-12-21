import { takeUntil, filter } from 'rxjs/operators';
import { WarehouseService } from '../warehouse.service';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseComponent } from '../../../lib/base-component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-warehouse-report',
  templateUrl: './warehouse-report.component.html',
  styleUrls: ['./warehouse-report.component.scss']
})
export class WarehouseReportComponent extends BaseComponent {
  componentName = 'WarehouseReportComponent';

  tabs: any[];
  formItem: FormGroup;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<WarehouseReportComponent>,
    public accountingService?: WarehouseService,
    public formBuilder?: FormBuilder,
  ) {
    super(commonService, router, apiService, ref);

    const reportFromDate = localStorage.getItem('Warehouse.ReportFromDate');
    const reportToDate = localStorage.getItem('Warehouse.ReportToDate');
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
    await this.commonService.waitForReady();
    this.tabs = [
      {
        title: this.commonService.translateText('Warehouse.SummaryReport.label'),
        route: '/accounting/report/summary',
        icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.commonService.translateText('Đối soát công nợ'),
        route: '/accounting/report/cash-flow',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.commonService.translateText('Warehouse.LiabilitiesReport.label'),
        route: '/accounting/report/liabilities',
        // icon: 'pie-chart',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: this.commonService.translateText('Warehouse.ReceivablesFromCustomersReport.label'),
        route: '/accounting/report/receivables-from-customers-report',
        // icon: 'pie-chart',
      },
      {
        title: this.commonService.translateText('Warehouse.ReceivablesFromEmployeeReport.label'),
        route: '/accounting/report/receivables-from-employee-report',
        // icon: 'pie-chart',
      },
      {
        title: this.commonService.translateText('Góp vốn'),
        route: '/accounting/report/contributed-capital-report',
        // icon: 'pie-chart',
      },
      {
        title: this.commonService.translateText('Warehouse.ProfitReport.label'),
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
