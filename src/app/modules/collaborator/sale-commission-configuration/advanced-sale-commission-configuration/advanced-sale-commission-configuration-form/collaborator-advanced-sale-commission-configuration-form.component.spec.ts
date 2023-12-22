import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAdvancedSaleCommissionConfigurationFormComponent } from './collaborator-advanced-sale-commission-configuration-form.component';

describe('CollaboratorAdvancedSaleCommissionConfigurationFormComponent', () => {
  let component: CollaboratorAdvancedSaleCommissionConfigurationFormComponent;
  let fixture: ComponentFixture<CollaboratorAdvancedSaleCommissionConfigurationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAdvancedSaleCommissionConfigurationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAdvancedSaleCommissionConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
