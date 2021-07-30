import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseGoodsListComponent } from './purchase-goods-list.component';

describe('WarehouseGoodsListComponent', () => {
  let component: PurchaseGoodsListComponent;
  let fixture: ComponentFixture<PurchaseGoodsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseGoodsListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseGoodsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
