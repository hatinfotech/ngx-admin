import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccMasterBookHeadBankAccountAmountComponent } from './acc-master-book-head-bank-account-amount.component';

describe('AccMasterBookHeadBankAccountAmountComponent', () => {
  let component: AccMasterBookHeadBankAccountAmountComponent;
  let fixture: ComponentFixture<AccMasterBookHeadBankAccountAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccMasterBookHeadBankAccountAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccMasterBookHeadBankAccountAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
