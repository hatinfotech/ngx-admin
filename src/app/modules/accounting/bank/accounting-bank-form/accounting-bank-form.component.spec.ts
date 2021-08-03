import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingBankFormComponent } from './accounting-bank-form.component';

describe('AccountingBankFormComponent', () => {
  let component: AccountingBankFormComponent;
  let fixture: ComponentFixture<AccountingBankFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingBankFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingBankFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
