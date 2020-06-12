import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesVoucherListComponent } from './sales-voucher-list.component';

describe('SalesVoucherListComponent', () => {
  let component: SalesVoucherListComponent;
  let fixture: ComponentFixture<SalesVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesVoucherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
