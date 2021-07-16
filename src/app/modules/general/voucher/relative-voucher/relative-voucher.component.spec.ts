import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativeVoucherComponent } from './relative-voucher.component';

describe('RelativeVoucherComponent', () => {
  let component: RelativeVoucherComponent;
  let fixture: ComponentFixture<RelativeVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativeVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativeVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
