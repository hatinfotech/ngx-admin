import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorRebuyStrategyProductFormComponent } from './collaborator-rebuy-strategy-product-form.component';

describe('CollaboratorProductFormComponent', () => {
  let component: CollaboratorRebuyStrategyProductFormComponent;
  let fixture: ComponentFixture<CollaboratorRebuyStrategyProductFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorRebuyStrategyProductFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorRebuyStrategyProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
