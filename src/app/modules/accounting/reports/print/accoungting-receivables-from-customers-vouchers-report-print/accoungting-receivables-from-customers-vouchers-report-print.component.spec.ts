import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent } from './accoungting-receivables-from-customers-vouchers-report-print.component';


describe('AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent', () => {
  let component: AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent;
  let fixture: ComponentFixture<AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
