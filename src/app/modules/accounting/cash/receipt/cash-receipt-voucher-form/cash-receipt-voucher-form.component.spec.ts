import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReceiptVoucherFormComponent } from './cash-receipt-voucher-form.component';

describe('CashReceiptVoucherFormComponent', () => {
  let component: CashReceiptVoucherFormComponent;
  let fixture: ComponentFixture<CashReceiptVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashReceiptVoucherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashReceiptVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
