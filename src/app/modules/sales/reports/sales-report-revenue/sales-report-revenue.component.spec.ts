import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportRevenueComponent } from './sales-report-revenue.component';

describe('SalesReportRevenueComponent', () => {
  let component: SalesReportRevenueComponent;
  let fixture: ComponentFixture<SalesReportRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReportRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReportRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
