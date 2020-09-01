import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsReceiptNoteFormComponent } from './warehouse-goods-receipt-note-form.component';

describe('WarehouseGoodsReceiptNoteFormComponent', () => {
  let component: WarehouseGoodsReceiptNoteFormComponent;
  let fixture: ComponentFixture<WarehouseGoodsReceiptNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsReceiptNoteFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsReceiptNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
