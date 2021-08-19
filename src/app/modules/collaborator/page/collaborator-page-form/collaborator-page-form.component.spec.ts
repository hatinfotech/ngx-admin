import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPageFormComponent } from './collaborator-page-form.component';

describe('CollaboratorPageFormComponent', () => {
  let component: CollaboratorPageFormComponent;
  let fixture: ComponentFixture<CollaboratorPageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
