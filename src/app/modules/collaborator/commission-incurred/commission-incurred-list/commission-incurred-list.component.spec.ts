import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionIncurredListComponent } from './collaborator-commission-incurred-list.component';

describe('CollaboratorCommissionIncurredListComponent', () => {
  let component: CollaboratorCommissionIncurredListComponent;
  let fixture: ComponentFixture<CollaboratorCommissionIncurredListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionIncurredListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionIncurredListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
