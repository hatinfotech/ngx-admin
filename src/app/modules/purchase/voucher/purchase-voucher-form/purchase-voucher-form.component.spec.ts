import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVoucherFormComponent } from './purchase-voucher-form.component';

describe('PurchaseVoucherFormComponent', () => {
  let component: PurchaseVoucherFormComponent;
  let fixture: ComponentFixture<PurchaseVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseVoucherFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
