import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnsVoucherFormComponent } from './sales-returns-voucher-form.component';

describe('SalesReturnsVoucherFormComponent', () => {
  let component: SalesReturnsVoucherFormComponent;
  let fixture: ComponentFixture<SalesReturnsVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReturnsVoucherFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReturnsVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
