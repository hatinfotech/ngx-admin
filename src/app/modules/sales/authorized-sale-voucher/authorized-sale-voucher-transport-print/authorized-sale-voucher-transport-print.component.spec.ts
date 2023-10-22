import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedSaleVoucherTransportPrintComponent } from './authorized-sale-voucher-transport-print.component';

describe('AuthorizedSaleVoucherTransportPrintComponent', () => {
  let component: AuthorizedSaleVoucherTransportPrintComponent;
  let fixture: ComponentFixture<AuthorizedSaleVoucherTransportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedSaleVoucherTransportPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedSaleVoucherTransportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
