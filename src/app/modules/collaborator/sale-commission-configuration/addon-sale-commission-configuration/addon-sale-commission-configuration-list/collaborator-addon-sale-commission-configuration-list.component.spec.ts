import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAddonSaleCommissionConfigurationListComponent } from './collaborator-addon-sale-commission-configuration-list.component';

describe('CollaboratorAddonSaleCommissionConfigurationListComponent', () => {
  let component: CollaboratorAddonSaleCommissionConfigurationListComponent;
  let fixture: ComponentFixture<CollaboratorAddonSaleCommissionConfigurationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAddonSaleCommissionConfigurationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAddonSaleCommissionConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
