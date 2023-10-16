import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleByCommissionVoucherFormComponent } from './sale-by-commission-voucher-form.component';

describe('SaleByCommissionVoucherFormComponent', () => {
  let component: SaleByCommissionVoucherFormComponent;
  let fixture: ComponentFixture<SaleByCommissionVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleByCommissionVoucherFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleByCommissionVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
