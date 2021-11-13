import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoungtingReceivablesFromCustomersReportPrintComponent } from './accoungting-receivables-from-customers-details-report-print.component';

describe('CashPaymentVoucherPrintComponent', () => {
  let component: AccoungtingReceivablesFromCustomersReportPrintComponent;
  let fixture: ComponentFixture<AccoungtingReceivablesFromCustomersReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccoungtingReceivablesFromCustomersReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccoungtingReceivablesFromCustomersReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
