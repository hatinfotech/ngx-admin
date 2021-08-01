import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingSummaryReportComponent } from './accounting-summary-report.component';

describe('SummaryReportComponent', () => {
  let component: AccountingSummaryReportComponent;
  let fixture: ComponentFixture<AccountingSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
