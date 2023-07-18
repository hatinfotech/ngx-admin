import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAdvanceStrategyFormComponent } from './collaborator-advance-strategy-form.component';

describe('CollaboratorAdvanceStrategyFormComponent', () => {
  let component: CollaboratorAdvanceStrategyFormComponent;
  let fixture: ComponentFixture<CollaboratorAdvanceStrategyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAdvanceStrategyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAdvanceStrategyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
