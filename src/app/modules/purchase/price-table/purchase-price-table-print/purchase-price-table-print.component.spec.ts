import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriceTablePrintComponent } from './purchase-price-table-print.component';

describe('PurchasePriceTablePrintComponent', () => {
  let component: PurchasePriceTablePrintComponent;
  let fixture: ComponentFixture<PurchasePriceTablePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePriceTablePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePriceTablePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
