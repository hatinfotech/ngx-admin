import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorUnitFormComponent } from './collaborator-unit-form.component';

describe('CollaboratorUnitFormComponent', () => {
  let component: CollaboratorUnitFormComponent;
  let fixture: ComponentFixture<CollaboratorUnitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorUnitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorUnitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
