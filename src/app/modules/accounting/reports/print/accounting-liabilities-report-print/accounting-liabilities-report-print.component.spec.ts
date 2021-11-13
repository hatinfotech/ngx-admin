import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingLiabilitiesReportPrintComponent } from './accounting-liabilities-report-print.component';

describe('CashPaymentVoucherPrintComponent', () => {
  let component: AccountingLiabilitiesReportPrintComponent;
  let fixture: ComponentFixture<AccountingLiabilitiesReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingLiabilitiesReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingLiabilitiesReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
