import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAwardListComponent } from './collaborator-award-list.component';

describe('CollaboratorPublisherAwardListComponent', () => {
  let component: CollaboratorAwardListComponent;
  let fixture: ComponentFixture<CollaboratorAwardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAwardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAwardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
