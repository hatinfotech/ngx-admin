import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountingAccountDetailsReportPrintComponent } from './accounting-account-details-report-print.component';


describe('AccountingAccountDetailsReportPrintComponent', () => {
  let component: AccountingAccountDetailsReportPrintComponent;
  let fixture: ComponentFixture<AccountingAccountDetailsReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingAccountDetailsReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingAccountDetailsReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
