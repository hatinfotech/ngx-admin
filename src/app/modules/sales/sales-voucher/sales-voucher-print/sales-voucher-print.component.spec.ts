import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesVoucherPrintComponent } from './sales-voucher-print.component';

describe('SalesVoucherPrintComponent', () => {
  let component: SalesVoucherPrintComponent;
  let fixture: ComponentFixture<SalesVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesVoucherPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
