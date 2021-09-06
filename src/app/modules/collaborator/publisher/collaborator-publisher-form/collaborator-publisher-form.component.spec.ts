import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherFormComponent } from './collaborator-publisher-form.component';

describe('CollaboratorPublisherFormComponent', () => {
  let component: CollaboratorPublisherFormComponent;
  let fixture: ComponentFixture<CollaboratorPublisherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
