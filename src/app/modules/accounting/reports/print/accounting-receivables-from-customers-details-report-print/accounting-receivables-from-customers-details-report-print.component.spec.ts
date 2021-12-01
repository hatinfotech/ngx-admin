import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountingReceivablesFromCustomersDetailsReportPrintComponent } from './accounting-receivables-from-customers-details-report-print.component';


describe('AccountingReceivablesFromCustomersDetailsReportPrintComponent', () => {
  let component: AccountingReceivablesFromCustomersDetailsReportPrintComponent;
  let fixture: ComponentFixture<AccountingReceivablesFromCustomersDetailsReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingReceivablesFromCustomersDetailsReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReceivablesFromCustomersDetailsReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
