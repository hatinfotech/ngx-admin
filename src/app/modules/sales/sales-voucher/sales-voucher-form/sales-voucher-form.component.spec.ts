import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesVoucherFormComponent } from './sales-voucher-form.component';

describe('SalesVoucherFormComponent', () => {
  let component: SalesVoucherFormComponent;
  let fixture: ComponentFixture<SalesVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesVoucherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
