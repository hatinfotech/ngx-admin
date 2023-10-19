import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedSaleVoucherFormComponent } from './authorized-sale-voucher-form.component';

describe('AuthorizedSaleVoucherFormComponent', () => {
  let component: AuthorizedSaleVoucherFormComponent;
  let fixture: ComponentFixture<AuthorizedSaleVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedSaleVoucherFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedSaleVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
