import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorRebuyStrategyListComponent } from './collaborator-rebuy-strategy-list.component';

describe('CollaboratorRebuyStrategyListComponent', () => {
  let component: CollaboratorRebuyStrategyListComponent;
  let fixture: ComponentFixture<CollaboratorRebuyStrategyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorRebuyStrategyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorRebuyStrategyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
