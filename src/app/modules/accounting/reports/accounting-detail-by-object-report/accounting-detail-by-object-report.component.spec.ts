import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingDetailByObjectReportComponent } from './accounting-detail-by-object-report.component';

describe('AccountingDetailByObjectReportComponent', () => {
  let component: AccountingDetailByObjectReportComponent;
  let fixture: ComponentFixture<AccountingDetailByObjectReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingDetailByObjectReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingDetailByObjectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
