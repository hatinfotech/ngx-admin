import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingOtherBusinessVoucherFormComponent } from './AccountingOtherBusinessVoucherFormComponent';

describe('AccountingOtherBusinessVoucherFormComponent', () => {
  let component: AccountingOtherBusinessVoucherFormComponent;
  let fixture: ComponentFixture<AccountingOtherBusinessVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingOtherBusinessVoucherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingOtherBusinessVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
