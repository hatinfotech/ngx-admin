import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifunctionalPurchaseGoodsReceiptPrintComponent } from './multifunctional-purchase-goods-receipt-print.component';

describe('MultifunctionalPurchaseGoodsReceiptPrintComponent', () => {
  let component: MultifunctionalPurchaseGoodsReceiptPrintComponent;
  let fixture: ComponentFixture<MultifunctionalPurchaseGoodsReceiptPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultifunctionalPurchaseGoodsReceiptPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifunctionalPurchaseGoodsReceiptPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
