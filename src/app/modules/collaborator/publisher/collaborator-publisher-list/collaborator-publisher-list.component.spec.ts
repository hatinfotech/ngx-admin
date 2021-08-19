import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherListComponent } from './collaborator-publisher-list.component';

describe('CollaboratorPublisherListComponent', () => {
  let component: CollaboratorPublisherListComponent;
  let fixture: ComponentFixture<CollaboratorPublisherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
