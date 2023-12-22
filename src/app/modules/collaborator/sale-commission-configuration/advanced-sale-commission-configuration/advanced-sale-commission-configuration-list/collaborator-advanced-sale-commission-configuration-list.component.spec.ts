import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAdvancedSaleCommissionConfigurationListComponent } from './collaborator-advanced-sale-commission-configuration-list.component';

describe('CollaboratorAdvancedSaleCommissionConfigurationListComponent', () => {
  let component: CollaboratorAdvancedSaleCommissionConfigurationListComponent;
  let fixture: ComponentFixture<CollaboratorAdvancedSaleCommissionConfigurationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAdvancedSaleCommissionConfigurationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAdvancedSaleCommissionConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
