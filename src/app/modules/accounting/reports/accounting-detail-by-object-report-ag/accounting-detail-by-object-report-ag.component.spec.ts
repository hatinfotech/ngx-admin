import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingDetailByObjectReportAgComponent } from './accounting-detail-by-object-report-ag.component';

describe('AccountingDetailByObjectReportAgComponent', () => {
  let component: AccountingDetailByObjectReportAgComponent;
  let fixture: ComponentFixture<AccountingDetailByObjectReportAgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingDetailByObjectReportAgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingDetailByObjectReportAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
