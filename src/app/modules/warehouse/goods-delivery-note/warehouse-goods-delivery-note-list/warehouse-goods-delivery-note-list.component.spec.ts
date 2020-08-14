import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsDeliveryNoteListComponent } from './warehouse-goods-delivery-note-list.component';

describe('WarehouseGoodsDeliveryNoteListComponent', () => {
  let component: WarehouseGoodsDeliveryNoteListComponent;
  let fixture: ComponentFixture<WarehouseGoodsDeliveryNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsDeliveryNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsDeliveryNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
