import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorKpiAwardPrintComponent } from './kpi-award-print.component';

describe('CollaboratorPublisherAwardPrintComponent', () => {
  let component: CollaboratorKpiAwardPrintComponent;
  let fixture: ComponentFixture<CollaboratorKpiAwardPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiAwardPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiAwardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
