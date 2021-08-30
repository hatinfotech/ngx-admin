import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherCommissionFormComponent } from './collaborator-publisher-commission-form.component';

describe('CollaboratorPublisherCommissionFormComponent', () => {
  let component: CollaboratorPublisherCommissionFormComponent;
  let fixture: ComponentFixture<CollaboratorPublisherCommissionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherCommissionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherCommissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
