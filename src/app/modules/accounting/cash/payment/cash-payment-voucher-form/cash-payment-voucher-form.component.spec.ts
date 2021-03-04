import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentVoucherFormComponent } from './cash-payment-voucher-form.component';

describe('CashPaymentVoucherFormComponent', () => {
  let component: CashPaymentVoucherFormComponent;
  let fixture: ComponentFixture<CashPaymentVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashPaymentVoucherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashPaymentVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
