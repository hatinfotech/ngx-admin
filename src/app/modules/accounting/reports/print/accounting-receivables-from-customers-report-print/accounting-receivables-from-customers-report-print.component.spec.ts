import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingReceivablesFromCustomersReportPrintComponent } from './accounting-receivables-from-customers-report-print.component';

describe('CashPaymentVoucherPrintComponent', () => {
  let component: AccountingReceivablesFromCustomersReportPrintComponent;
  let fixture: ComponentFixture<AccountingReceivablesFromCustomersReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingReceivablesFromCustomersReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReceivablesFromCustomersReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
