import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsReceiptNoteListComponent } from './warehouse-goods-receipt-note-list.component';

describe('WarehouseGoodsReceiptNoteListComponent', () => {
  let component: WarehouseGoodsReceiptNoteListComponent;
  let fixture: ComponentFixture<WarehouseGoodsReceiptNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsReceiptNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsReceiptNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
