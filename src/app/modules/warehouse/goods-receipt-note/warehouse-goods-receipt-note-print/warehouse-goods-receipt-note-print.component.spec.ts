import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsReceiptNotePrintComponent } from './warehouse-goods-receipt-note-print.component';

describe('WarehouseGoodsReceiptNotePrintComponent', () => {
  let component: WarehouseGoodsReceiptNotePrintComponent;
  let fixture: ComponentFixture<WarehouseGoodsReceiptNotePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsReceiptNotePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsReceiptNotePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
