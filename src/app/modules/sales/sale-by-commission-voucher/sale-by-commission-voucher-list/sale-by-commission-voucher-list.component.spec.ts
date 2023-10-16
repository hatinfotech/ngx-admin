import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleByCommissionVoucherListComponent } from './sale-by-commission-voucher-list.component';

describe('SaleByCommissionVoucherListComponent', () => {
  let component: SaleByCommissionVoucherListComponent;
  let fixture: ComponentFixture<SaleByCommissionVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleByCommissionVoucherListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleByCommissionVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
