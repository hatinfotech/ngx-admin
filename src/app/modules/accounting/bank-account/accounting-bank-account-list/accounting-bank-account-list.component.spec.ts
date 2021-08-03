import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingBankAccountListComponent } from './accounting-bank-account-list.component';

describe('AccountingBankAccountListComponent', () => {
  let component: AccountingBankAccountListComponent;
  let fixture: ComponentFixture<AccountingBankAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingBankAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingBankAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
