import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPageListComponent } from './collaborator-page-list.component';

describe('CollaboratorPageListComponent', () => {
  let component: CollaboratorPageListComponent;
  let fixture: ComponentFixture<CollaboratorPageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
