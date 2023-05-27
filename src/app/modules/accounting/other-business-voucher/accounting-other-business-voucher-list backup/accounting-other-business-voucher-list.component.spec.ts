import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingOtherBusinessVoucherListComponent } from './accounting-other-business-voucher-list.component';

describe('AccountingOtherBusinessVoucherListComponent', () => {
  let component: AccountingOtherBusinessVoucherListComponent;
  let fixture: ComponentFixture<AccountingOtherBusinessVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingOtherBusinessVoucherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingOtherBusinessVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
