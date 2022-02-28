import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseGoodsFindOrderTempPrintComponent } from './warehouse-goods-find-order-temp-print.component';


describe('WarehouseGoodsPrintComponent', () => {
  let component: WarehouseGoodsFindOrderTempPrintComponent;
  let fixture: ComponentFixture<WarehouseGoodsFindOrderTempPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsFindOrderTempPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsFindOrderTempPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
