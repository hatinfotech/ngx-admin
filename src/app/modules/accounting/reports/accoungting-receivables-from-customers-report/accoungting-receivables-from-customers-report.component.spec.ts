import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoungtingReceivablesFromCustomersReportComponent } from './accoungting-receivables-from-customers-report.component';

describe('AccoungtingReceivablesFromCustomersReportComponent', () => {
  let component: AccoungtingReceivablesFromCustomersReportComponent;
  let fixture: ComponentFixture<AccoungtingReceivablesFromCustomersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccoungtingReceivablesFromCustomersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccoungtingReceivablesFromCustomersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
