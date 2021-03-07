import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentVoucherPrintComponent } from './cash-payment-voucher-print.component';

describe('CashPaymentVoucherPrintComponent', () => {
  let component: CashPaymentVoucherPrintComponent;
  let fixture: ComponentFixture<CashPaymentVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashPaymentVoucherPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashPaymentVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
