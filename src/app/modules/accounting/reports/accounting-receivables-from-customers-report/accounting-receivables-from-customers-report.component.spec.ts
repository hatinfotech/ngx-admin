import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingReceivablesFromCustomersReportComponent } from './accounting-receivables-from-customers-report.component';

describe('AccountingReceivablesFromCustomersReportComponent', () => {
  let component: AccountingReceivablesFromCustomersReportComponent;
  let fixture: ComponentFixture<AccountingReceivablesFromCustomersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingReceivablesFromCustomersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReceivablesFromCustomersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
