import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedSaleVoucherPrintComponent } from './authorized-sale-voucher-print.component';

describe('AuthorizedSaleVoucherPrintComponent', () => {
  let component: AuthorizedSaleVoucherPrintComponent;
  let fixture: ComponentFixture<AuthorizedSaleVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedSaleVoucherPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedSaleVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
