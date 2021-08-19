import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPageSummaryComponent } from './collaborator-page-summary.component';

describe('CollaboratorPageSummaryComponent', () => {
  let component: CollaboratorPageSummaryComponent;
  let fixture: ComponentFixture<CollaboratorPageSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPageSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
