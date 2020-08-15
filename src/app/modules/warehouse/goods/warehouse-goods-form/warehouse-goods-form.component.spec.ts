import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsFormComponent } from './warehouse-goods-form.component';

describe('WarehouseGoodsFormComponent', () => {
  let component: WarehouseGoodsFormComponent;
  let fixture: ComponentFixture<WarehouseGoodsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
