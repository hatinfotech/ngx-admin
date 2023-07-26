import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorKpiGroupListComponent } from './kpi-group-list.component';

describe('CollaboratorKpiGroupListComponent', () => {
  let component: CollaboratorKpiGroupListComponent;
  let fixture: ComponentFixture<CollaboratorKpiGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
