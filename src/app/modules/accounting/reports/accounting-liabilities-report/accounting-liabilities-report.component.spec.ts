import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingLiabilitiesReportComponent } from './accounting-liabilities-report.component';

describe('AccountingLiabilitiesReportComponent', () => {
  let component: AccountingLiabilitiesReportComponent;
  let fixture: ComponentFixture<AccountingLiabilitiesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingLiabilitiesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingLiabilitiesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
