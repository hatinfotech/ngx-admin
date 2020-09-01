import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsContainerPrintComponent } from './warehouse-goods-container-print.component';

describe('WarehouseGoodsContainerPrintComponent', () => {
  let component: WarehouseGoodsContainerPrintComponent;
  let fixture: ComponentFixture<WarehouseGoodsContainerPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsContainerPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsContainerPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
