import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseBookHeadAmountComponent } from './warehouse-book-head-amount.component';

describe('WarehouseBookHeadAmountComponent', () => {
  let component: WarehouseBookHeadAmountComponent;
  let fixture: ComponentFixture<WarehouseBookHeadAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseBookHeadAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseBookHeadAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
