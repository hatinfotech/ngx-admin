import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPageDashboardComponent } from './collaborator-page-dashboard.component';

describe('CollaboratorPageSummaryComponent', () => {
  let component: CollaboratorPageDashboardComponent;
  let fixture: ComponentFixture<CollaboratorPageDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPageDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
