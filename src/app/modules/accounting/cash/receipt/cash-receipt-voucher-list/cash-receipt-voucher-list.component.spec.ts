import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReceiptVoucherListComponent } from './cash-receipt-voucher-list.component';

describe('CashReceiptVoucherListComponent', () => {
  let component: CashReceiptVoucherListComponent;
  let fixture: ComponentFixture<CashReceiptVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashReceiptVoucherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashReceiptVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
