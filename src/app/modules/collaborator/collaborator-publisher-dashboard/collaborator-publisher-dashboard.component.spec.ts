import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherDashboardComponent } from './collaborator-publisher-dashboard.component';

describe('CollaboratorPageSummaryComponent', () => {
  let component: CollaboratorPublisherDashboardComponent;
  let fixture: ComponentFixture<CollaboratorPublisherDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
