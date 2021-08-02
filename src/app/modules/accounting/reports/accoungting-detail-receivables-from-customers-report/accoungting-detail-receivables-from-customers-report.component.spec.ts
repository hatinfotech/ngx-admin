import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoungtingDetailReceivablesFromCustomersReportComponent } from './accoungting-detail-receivables-from-customers-report.component';

describe('AccoungtingDetailReceivablesFromCustomersReportComponent', () => {
  let component: AccoungtingDetailReceivablesFromCustomersReportComponent;
  let fixture: ComponentFixture<AccoungtingDetailReceivablesFromCustomersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccoungtingDetailReceivablesFromCustomersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccoungtingDetailReceivablesFromCustomersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
