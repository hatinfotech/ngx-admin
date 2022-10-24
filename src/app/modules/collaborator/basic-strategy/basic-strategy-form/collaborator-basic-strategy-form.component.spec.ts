import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorBasicStrategyFormComponent } from './collaborator-basic-strategy-form-form.component';

describe('CollaboratorBasicStrategyFormComponent', () => {
  let component: CollaboratorBasicStrategyFormComponent;
  let fixture: ComponentFixture<CollaboratorBasicStrategyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorBasicStrategyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorBasicStrategyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
