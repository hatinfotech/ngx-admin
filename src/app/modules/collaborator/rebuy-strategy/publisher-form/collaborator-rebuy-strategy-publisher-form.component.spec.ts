import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorRebuyStrategyPublisherFormComponent } from './collaborator-rebuy-strategy-publisher-form.component';

describe('CollaboratorRebuyStrategyPublisherFormComponent', () => {
  let component: CollaboratorRebuyStrategyPublisherFormComponent;
  let fixture: ComponentFixture<CollaboratorRebuyStrategyPublisherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorRebuyStrategyPublisherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorRebuyStrategyPublisherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
