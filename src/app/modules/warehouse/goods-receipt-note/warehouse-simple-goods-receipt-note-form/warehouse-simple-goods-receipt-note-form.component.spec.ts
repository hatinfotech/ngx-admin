import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSimpleGoodsReceiptNoteFormComponent } from './warehouse-simple-goods-receipt-note-form.component';

describe('WarehouseSimpleGoodsReceiptNoteFormComponent', () => {
  let component: WarehouseSimpleGoodsReceiptNoteFormComponent;
  let fixture: ComponentFixture<WarehouseSimpleGoodsReceiptNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseSimpleGoodsReceiptNoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseSimpleGoodsReceiptNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
