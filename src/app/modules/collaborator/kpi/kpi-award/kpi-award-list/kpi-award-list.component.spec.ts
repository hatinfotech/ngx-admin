import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorKpiAwardListComponent } from './kpi-award-list.component';

describe('CollaboratorPublisherAwardListComponent', () => {
  let component: CollaboratorKpiAwardListComponent;
  let fixture: ComponentFixture<CollaboratorKpiAwardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiAwardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiAwardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
