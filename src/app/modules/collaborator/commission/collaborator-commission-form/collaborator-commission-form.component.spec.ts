import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionFormComponent } from './collaborator-commission-form.component';

describe('CollaboratorPublisherCommissionFormComponent', () => {
  let component: CollaboratorCommissionFormComponent;
  let fixture: ComponentFixture<CollaboratorCommissionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
