import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentVoucherListComponent } from './cash-payment-voucher-list.component';

describe('CashPaymentVoucherListComponent', () => {
  let component: CashPaymentVoucherListComponent;
  let fixture: ComponentFixture<CashPaymentVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashPaymentVoucherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashPaymentVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
