import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleByCommissionVoucherPrintComponent } from './sale-by-commission-voucher-print.component';

describe('SaleByCommissionVoucherPrintComponent', () => {
  let component: SaleByCommissionVoucherPrintComponent;
  let fixture: ComponentFixture<SaleByCommissionVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleByCommissionVoucherPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleByCommissionVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
