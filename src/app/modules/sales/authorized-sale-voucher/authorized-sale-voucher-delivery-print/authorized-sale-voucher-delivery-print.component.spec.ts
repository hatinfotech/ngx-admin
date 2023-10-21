import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedSaleVoucherDeliveryPrintComponent } from './authorized-sale-voucher-delivery-print.component';

describe('AuthorizedSaleVoucherDeliveryPrintComponent', () => {
  let component: AuthorizedSaleVoucherDeliveryPrintComponent;
  let fixture: ComponentFixture<AuthorizedSaleVoucherDeliveryPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedSaleVoucherDeliveryPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedSaleVoucherDeliveryPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
