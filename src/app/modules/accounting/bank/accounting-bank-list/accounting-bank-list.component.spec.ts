import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingBankListComponent } from './accounting-bank-list.component';

describe('AccountingBankListComponent', () => {
  let component: AccountingBankListComponent;
  let fixture: ComponentFixture<AccountingBankListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingBankListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingBankListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
