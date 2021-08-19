import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherReportComponent } from './collaborator-publisher-report.component';

describe('CollaboratorPublisherReportComponent', () => {
  let component: CollaboratorPublisherReportComponent;
  let fixture: ComponentFixture<CollaboratorPublisherReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
