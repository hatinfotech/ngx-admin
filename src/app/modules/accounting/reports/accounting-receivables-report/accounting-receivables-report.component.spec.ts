import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingReceivablesReportComponent } from './accounting-receivables-report.component';

describe('AccountingReceivablesReportComponent', () => {
  let component: AccountingReceivablesReportComponent;
  let fixture: ComponentFixture<AccountingReceivablesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingReceivablesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReceivablesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
