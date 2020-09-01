import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPriceReportFormComponent } from './sales-price-report-form.component';

describe('SalesPriceReportFormComponent', () => {
  let component: SalesPriceReportFormComponent;
  let fixture: ComponentFixture<SalesPriceReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPriceReportFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPriceReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
