import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifunctionalPurchaseSupplierPrintComponent } from './multifunctional-purchase-supplier-print.component';

describe('MultifunctionalPurchaseSupplierPrintComponent', () => {
  let component: MultifunctionalPurchaseSupplierPrintComponent;
  let fixture: ComponentFixture<MultifunctionalPurchaseSupplierPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultifunctionalPurchaseSupplierPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifunctionalPurchaseSupplierPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
