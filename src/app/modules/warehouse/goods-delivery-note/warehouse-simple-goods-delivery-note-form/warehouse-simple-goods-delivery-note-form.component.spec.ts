import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSimpleGoodsDeliveryNoteFormComponent } from './warehouse-simple-goods-delivery-note-form.component';

describe('WarehouseSimpleGoodsDeliveryNoteFormComponent', () => {
  let component: WarehouseSimpleGoodsDeliveryNoteFormComponent;
  let fixture: ComponentFixture<WarehouseSimpleGoodsDeliveryNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseSimpleGoodsDeliveryNoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseSimpleGoodsDeliveryNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
