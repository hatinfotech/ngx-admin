import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionIncurredFormComponent } from './collaborator-commission-incurred-form.component';

describe('CollaboratorCommissionIncurredFormComponent', () => {
  let component: CollaboratorCommissionIncurredFormComponent;
  let fixture: ComponentFixture<CollaboratorCommissionIncurredFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionIncurredFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionIncurredFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
