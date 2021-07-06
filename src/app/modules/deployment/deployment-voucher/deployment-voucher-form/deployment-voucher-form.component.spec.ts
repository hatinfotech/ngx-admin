import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentVoucherFormComponent } from './deployment-voucher-form.component';

describe('DeploymentVoucherFormComponent', () => {
  let component: DeploymentVoucherFormComponent;
  let fixture: ComponentFixture<DeploymentVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentVoucherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
