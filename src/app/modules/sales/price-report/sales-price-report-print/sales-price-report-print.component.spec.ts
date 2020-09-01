import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPriceReportPrintComponent } from './sales-price-report-print.component';

describe('SalesPriceReportPrintComponent', () => {
  let component: SalesPriceReportPrintComponent;
  let fixture: ComponentFixture<SalesPriceReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPriceReportPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPriceReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
