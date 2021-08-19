import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorUnitListComponent } from './collaborator-unit-list.component';

describe('CollaboratorUnitListComponent', () => {
  let component: CollaboratorUnitListComponent;
  let fixture: ComponentFixture<CollaboratorUnitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorUnitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorUnitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
