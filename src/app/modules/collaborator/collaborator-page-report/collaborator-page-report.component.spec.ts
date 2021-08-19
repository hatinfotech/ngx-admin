import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPageReportComponent } from './collaborator-page-report.component';

describe('CollaboratorPageReportComponent', () => {
  let component: CollaboratorPageReportComponent;
  let fixture: ComponentFixture<CollaboratorPageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
