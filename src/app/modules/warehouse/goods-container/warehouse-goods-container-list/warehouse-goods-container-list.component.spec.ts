import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsContainerListComponent } from './warehouse-goods-container-list.component';

describe('WarehouseGoodsContainerListComponent', () => {
  let component: WarehouseGoodsContainerListComponent;
  let fixture: ComponentFixture<WarehouseGoodsContainerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsContainerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsContainerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
