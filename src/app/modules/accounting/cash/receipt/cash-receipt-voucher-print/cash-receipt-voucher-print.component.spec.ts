import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReceiptVoucherPrintComponent } from './cash-receipt-voucher-print.component';

describe('CashReceiptVoucherPrintComponent', () => {
  let component: CashReceiptVoucherPrintComponent;
  let fixture: ComponentFixture<CashReceiptVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashReceiptVoucherPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashReceiptVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
