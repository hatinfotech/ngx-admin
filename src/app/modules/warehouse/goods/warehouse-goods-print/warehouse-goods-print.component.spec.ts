import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsPrintComponent } from './warehouse-goods-print.component';

describe('WarehouseGoodsPrintComponent', () => {
  let component: WarehouseGoodsPrintComponent;
  let fixture: ComponentFixture<WarehouseGoodsPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseGoodsPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseGoodsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
