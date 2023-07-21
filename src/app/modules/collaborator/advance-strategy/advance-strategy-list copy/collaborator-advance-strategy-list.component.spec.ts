import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAdvanceStrategyListComponent } from './collaborator-advance-strategy-list.component';

describe('CollaboratorAdvanceStrategyListComponent', () => {
  let component: CollaboratorAdvanceStrategyListComponent;
  let fixture: ComponentFixture<CollaboratorAdvanceStrategyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAdvanceStrategyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAdvanceStrategyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
