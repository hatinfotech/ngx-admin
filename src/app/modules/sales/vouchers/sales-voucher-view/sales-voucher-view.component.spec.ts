import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesVoucherViewComponent } from './sales-voucher-view.component';

describe('SalesVoucherViewComponent', () => {
  let component: SalesVoucherViewComponent;
  let fixture: ComponentFixture<SalesVoucherViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesVoucherViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesVoucherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
