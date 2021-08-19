import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherComponent } from './collaborator-publisher.component';

describe('CollaboratorPublisherComponent', () => {
  let component: CollaboratorPublisherComponent;
  let fixture: ComponentFixture<CollaboratorPublisherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
