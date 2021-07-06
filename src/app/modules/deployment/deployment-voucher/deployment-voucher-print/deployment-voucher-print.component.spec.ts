import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentVoucherPrintComponent } from './deployment-voucher-print.component';

describe('DeploymentVoucherPrintComponent', () => {
  let component: DeploymentVoucherPrintComponent;
  let fixture: ComponentFixture<DeploymentVoucherPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentVoucherPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
