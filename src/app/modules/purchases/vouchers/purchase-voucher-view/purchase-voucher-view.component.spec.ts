import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVoucherViewComponent } from './purchase-voucher-view.component';

describe('PurchaseVoucherViewComponent', () => {
  let component: PurchaseVoucherViewComponent;
  let fixture: ComponentFixture<PurchaseVoucherViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseVoucherViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseVoucherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
