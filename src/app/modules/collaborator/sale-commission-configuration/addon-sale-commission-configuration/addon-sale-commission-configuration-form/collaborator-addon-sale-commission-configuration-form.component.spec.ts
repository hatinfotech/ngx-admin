import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAddonSaleCommissionConfigurationFormComponent } from './collaborator-addon-sale-commission-configuration-form.component';

describe('CollaboratorAddonSaleCommissionConfigurationFormComponent', () => {
  let component: CollaboratorAddonSaleCommissionConfigurationFormComponent;
  let fixture: ComponentFixture<CollaboratorAddonSaleCommissionConfigurationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAddonSaleCommissionConfigurationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAddonSaleCommissionConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
