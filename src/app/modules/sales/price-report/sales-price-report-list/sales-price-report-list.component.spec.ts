import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPriceReportListComponent } from './sales-price-report-list.component';

describe('SalesPriceReportListComponent', () => {
  let component: SalesPriceReportListComponent;
  let fixture: ComponentFixture<SalesPriceReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPriceReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPriceReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
