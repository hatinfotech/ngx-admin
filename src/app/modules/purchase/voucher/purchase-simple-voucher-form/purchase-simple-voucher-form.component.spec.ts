import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSimpleVoucherFormComponent } from './purchase-simple-voucher-form.component';

describe('PurchaseSimpleVoucherFormComponent', () => {
  let component: PurchaseSimpleVoucherFormComponent;
  let fixture: ComponentFixture<PurchaseSimpleVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseSimpleVoucherFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseSimpleVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
