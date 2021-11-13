import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingLiabilitiesDetailsReportPrintComponent } from './accounting-liabilities-details-report-print.component';

describe('CashPaymentVoucherPrintComponent', () => {
  let component: AccountingLiabilitiesDetailsReportPrintComponent;
  let fixture: ComponentFixture<AccountingLiabilitiesDetailsReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingLiabilitiesDetailsReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingLiabilitiesDetailsReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
