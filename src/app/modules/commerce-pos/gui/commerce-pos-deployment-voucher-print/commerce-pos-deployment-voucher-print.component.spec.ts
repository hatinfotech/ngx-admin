import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercePosDeploymentVoucherPrintComponent } from './commerce-pos-deployment-voucher-print.component';

describe('CommercePosDeploymentVoucherPrintComponent', () => {
  let component: CommercePosDeploymentVoucherPrintComponent;
  let fixture: ComponentFixture<CommercePosDeploymentVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosDeploymentVoucherPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosDeploymentVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
