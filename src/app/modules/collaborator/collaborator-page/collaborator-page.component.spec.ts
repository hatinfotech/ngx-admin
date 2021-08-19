import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPageComponent } from './collaborator-page.component';

describe('CollaboratorPageComponent', () => {
  let component: CollaboratorPageComponent;
  let fixture: ComponentFixture<CollaboratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
