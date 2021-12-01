import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingProfitReportComponent } from './accounting-profit-report.component';

describe('AccountingProfitReportComponent', () => {
  let component: AccountingProfitReportComponent;
  let fixture: ComponentFixture<AccountingProfitReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingProfitReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingProfitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
