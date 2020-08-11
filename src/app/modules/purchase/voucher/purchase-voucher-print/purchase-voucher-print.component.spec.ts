import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVoucherPrintComponent } from './purchase-voucher-print.component';

describe('PurchaseVoucherPrintComponent', () => {
  let component: PurchaseVoucherPrintComponent;
  let fixture: ComponentFixture<PurchaseVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseVoucherPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
