import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingBankAccountFormComponent } from './accounting-bank-account-form.component';

describe('AccountingBankAccountFormComponent', () => {
  let component: AccountingBankAccountFormComponent;
  let fixture: ComponentFixture<AccountingBankAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingBankAccountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingBankAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
