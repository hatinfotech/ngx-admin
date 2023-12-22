import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorBasicSaleCommissionConfigurationListComponent } from './collaborator-basic-sale-commission-configuration-list.component';

describe('CollaboratorBasicSaleCommissionConfigurationListComponent', () => {
  let component: CollaboratorBasicSaleCommissionConfigurationListComponent;
  let fixture: ComponentFixture<CollaboratorBasicSaleCommissionConfigurationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorBasicSaleCommissionConfigurationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorBasicSaleCommissionConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
