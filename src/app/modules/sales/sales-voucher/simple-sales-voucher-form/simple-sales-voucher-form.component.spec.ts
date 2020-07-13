import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSalesVoucherFormComponent } from './simple-sales-voucher-form.component';

describe('SimpleSalesVoucherFormComponent', () => {
  let component: SimpleSalesVoucherFormComponent;
  let fixture: ComponentFixture<SimpleSalesVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleSalesVoucherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSalesVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
