import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingContraAccountReportComponent } from './accounting-contra-account-report.component';

describe('SummaryReportComponent', () => {
  let component: AccountingContraAccountReportComponent;
  let fixture: ComponentFixture<AccountingContraAccountReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingContraAccountReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingContraAccountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
