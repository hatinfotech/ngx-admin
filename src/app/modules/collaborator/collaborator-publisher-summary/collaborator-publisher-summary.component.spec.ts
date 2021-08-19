import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherSummaryComponent } from './collaborator-publisher-summary.component';

describe('CollaboratorPublisherSummaryComponent', () => {
  let component: CollaboratorPublisherSummaryComponent;
  let fixture: ComponentFixture<CollaboratorPublisherSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
