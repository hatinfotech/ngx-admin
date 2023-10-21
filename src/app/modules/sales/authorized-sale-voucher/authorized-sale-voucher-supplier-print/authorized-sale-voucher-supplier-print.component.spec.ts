import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedSaleVoucherSupplierPrintComponent } from './authorized-sale-voucher-supplier-print.component';

describe('AuthorizedSaleVoucherSupplierPrintComponent', () => {
  let component: AuthorizedSaleVoucherSupplierPrintComponent;
  let fixture: ComponentFixture<AuthorizedSaleVoucherSupplierPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedSaleVoucherSupplierPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedSaleVoucherSupplierPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
