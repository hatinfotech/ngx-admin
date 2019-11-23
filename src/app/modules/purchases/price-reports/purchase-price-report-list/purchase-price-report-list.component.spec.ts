import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriceReportListComponent } from './purchase-price-report-list.component';

describe('PurchasePriceReportListComponent', () => {
  let component: PurchasePriceReportListComponent;
  let fixture: ComponentFixture<PurchasePriceReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePriceReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePriceReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
