import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingOtherBusinessVoucherPrintComponent } from './accounting-other-business-voucher-print.component';

describe('AccountingOtherBusinessVoucherPrintComponent', () => {
  let component: AccountingOtherBusinessVoucherPrintComponent;
  let fixture: ComponentFixture<AccountingOtherBusinessVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingOtherBusinessVoucherPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingOtherBusinessVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
