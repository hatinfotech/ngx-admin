import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorRebuyStrategyFormComponent } from './collaborator-rebuy-strategy-form-form.component';

describe('CollaboratorRebuyStrategyFormComponent', () => {
  let component: CollaboratorRebuyStrategyFormComponent;
  let fixture: ComponentFixture<CollaboratorRebuyStrategyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorRebuyStrategyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorRebuyStrategyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
