import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriceTableListComponent } from './purchase-price-table-list.component';

describe('PurchasePriceTableListComponent', () => {
  let component: PurchasePriceTableListComponent;
  let fixture: ComponentFixture<PurchasePriceTableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePriceTableListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePriceTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
