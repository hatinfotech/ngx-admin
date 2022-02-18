import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent } from './warehouse-goods-access-number-print.component';


describe('WarehouseGoodsContainerPrintComponent', () => {
  let component: WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent;
  let fixture: ComponentFixture<WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
