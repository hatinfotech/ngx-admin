import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriceTableImportComponent } from './purchase-price-table-import.component';

describe('PurchasePriceTableImportComponent', () => {
  let component: PurchasePriceTableImportComponent;
  let fixture: ComponentFixture<PurchasePriceTableImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePriceTableImportComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePriceTableImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
