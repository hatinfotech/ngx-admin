import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsDeliveryNoteFormComponent } from './warehouse-goods-delivery-note-form.component';

describe('WarehouseGoodsDeliveryNoteFormComponent', () => {
  let component: WarehouseGoodsDeliveryNoteFormComponent;
  let fixture: ComponentFixture<WarehouseGoodsDeliveryNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsDeliveryNoteFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsDeliveryNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
