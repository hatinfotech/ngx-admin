import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsListComponent } from './warehouse-goods-list.component';

describe('WarehouseGoodsListComponent', () => {
  let component: WarehouseGoodsListComponent;
  let fixture: ComponentFixture<WarehouseGoodsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
