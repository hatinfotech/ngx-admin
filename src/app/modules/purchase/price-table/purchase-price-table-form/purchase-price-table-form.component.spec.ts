import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriceTableFormComponent } from './purchase-price-table-form.component';

describe('PurchasePriceTableFormComponent', () => {
  let component: PurchasePriceTableFormComponent;
  let fixture: ComponentFixture<PurchasePriceTableFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePriceTableFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePriceTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
