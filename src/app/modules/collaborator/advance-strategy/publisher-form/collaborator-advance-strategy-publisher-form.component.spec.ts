import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAdvanceStrategyPublisherFormComponent } from './collaborator-advance-strategy-publisher-form.component';

describe('CollaboratorAdvanceStrategyPublisherFormComponent', () => {
  let component: CollaboratorAdvanceStrategyPublisherFormComponent;
  let fixture: ComponentFixture<CollaboratorAdvanceStrategyPublisherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAdvanceStrategyPublisherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAdvanceStrategyPublisherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
