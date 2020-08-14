import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsContainerFormComponent } from './warehouse-goods-container-form.component';

describe('WarehouseGoodsContainerFormComponent', () => {
  let component: WarehouseGoodsContainerFormComponent;
  let fixture: ComponentFixture<WarehouseGoodsContainerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsContainerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsContainerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
