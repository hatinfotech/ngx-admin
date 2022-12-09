import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingContributedCapitalReportComponent } from './accounting-contributed-capital-report.component';

describe('AccountingReceivablesFromEmployeeReportComponent', () => {
  let component: AccountingContributedCapitalReportComponent;
  let fixture: ComponentFixture<AccountingContributedCapitalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingContributedCapitalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingContributedCapitalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
