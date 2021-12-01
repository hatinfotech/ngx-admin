import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingReceivablesFromEmployeeReportComponent } from './accounting-receivables-from-employee-report.component';

describe('AccountingReceivablesFromEmployeeReportComponent', () => {
  let component: AccountingReceivablesFromEmployeeReportComponent;
  let fixture: ComponentFixture<AccountingReceivablesFromEmployeeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingReceivablesFromEmployeeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReceivablesFromEmployeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
