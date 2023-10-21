import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedSaleVoucherCustomerPrintComponent } from './authorized-sale-voucher-customer-print.component';

describe('AuthorizedSaleVoucherCustomerPrintComponent', () => {
  let component: AuthorizedSaleVoucherCustomerPrintComponent;
  let fixture: ComponentFixture<AuthorizedSaleVoucherCustomerPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedSaleVoucherCustomerPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedSaleVoucherCustomerPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
