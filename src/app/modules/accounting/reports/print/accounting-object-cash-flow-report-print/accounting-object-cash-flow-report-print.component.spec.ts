import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountingObjectCashFlowReportPrintComponent } from './accounting-object-cash-flow-report-print.component';


describe('AccountingObjectCashFlowReportPrintComponent', () => {
  let component: AccountingObjectCashFlowReportPrintComponent;
  let fixture: ComponentFixture<AccountingObjectCashFlowReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingObjectCashFlowReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingObjectCashFlowReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
