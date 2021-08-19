import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorOrderFormComponent } from './collaborator-order-form.component';

describe('CollaboratorOrderFormComponent', () => {
  let component: CollaboratorOrderFormComponent;
  let fixture: ComponentFixture<CollaboratorOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorOrderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
