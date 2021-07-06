import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentVoucherListComponent } from './deployment-voucher-list.component';

describe('DeploymentVoucherListComponent', () => {
  let component: DeploymentVoucherListComponent;
  let fixture: ComponentFixture<DeploymentVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentVoucherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
