import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriceReportFormComponent } from './purchase-price-report-form.component';

describe('PurchasePriceReportFormComponent', () => {
  let component: PurchasePriceReportFormComponent;
  let fixture: ComponentFixture<PurchasePriceReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePriceReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePriceReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
