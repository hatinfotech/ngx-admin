import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingCashFlowReportComponent } from './accounting-cash-flow-report.component';

describe('AccountingCashFlowReportComponent', () => {
  let component: AccountingCashFlowReportComponent;
  let fixture: ComponentFixture<AccountingCashFlowReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingCashFlowReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingCashFlowReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
