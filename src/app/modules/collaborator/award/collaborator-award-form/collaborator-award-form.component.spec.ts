import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAwardFormComponent } from './collaborator-award-form.component';

describe('CollaboratorPublisherAwardFormComponent', () => {
  let component: CollaboratorAwardFormComponent;
  let fixture: ComponentFixture<CollaboratorAwardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAwardFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAwardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
