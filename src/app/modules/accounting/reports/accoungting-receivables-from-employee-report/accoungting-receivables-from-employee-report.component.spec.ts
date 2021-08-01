import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoungtingReceivablesFromEmployeeReportComponent } from './accoungting-receivables-from-employee-report.component';

describe('AccoungtingReceivablesFromEmployeeReportComponent', () => {
  let component: AccoungtingReceivablesFromEmployeeReportComponent;
  let fixture: ComponentFixture<AccoungtingReceivablesFromEmployeeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccoungtingReceivablesFromEmployeeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccoungtingReceivablesFromEmployeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
