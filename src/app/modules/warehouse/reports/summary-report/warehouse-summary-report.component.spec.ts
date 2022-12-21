import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSummaryReportComponent } from './warehouse-summary-report.component';

describe('SummaryReportComponent', () => {
  let component: WarehouseSummaryReportComponent;
  let fixture: ComponentFixture<WarehouseSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
