import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsDeliveryNotePrintComponent } from './warehouse-goods-delivery-note-print.component';

describe('WarehouseGoodsDeliveryNotePrintComponent', () => {
  let component: WarehouseGoodsDeliveryNotePrintComponent;
  let fixture: ComponentFixture<WarehouseGoodsDeliveryNotePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsDeliveryNotePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsDeliveryNotePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
