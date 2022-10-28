import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAddonStrategyFormComponent } from './collaborator-addon-strategy-form-form.component';

describe('CollaboratorAddonStrategyFormComponent', () => {
  let component: CollaboratorAddonStrategyFormComponent;
  let fixture: ComponentFixture<CollaboratorAddonStrategyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAddonStrategyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAddonStrategyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
