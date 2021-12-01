import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountingReceivablesFromCustomersVoucherssReportPrintComponent } from './accounting-receivables-from-customers-vouchers-report-print.component';


describe('AccountingReceivablesFromCustomersVoucherssReportPrintComponent', () => {
  let component: AccountingReceivablesFromCustomersVoucherssReportPrintComponent;
  let fixture: ComponentFixture<AccountingReceivablesFromCustomersVoucherssReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingReceivablesFromCustomersVoucherssReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReceivablesFromCustomersVoucherssReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
