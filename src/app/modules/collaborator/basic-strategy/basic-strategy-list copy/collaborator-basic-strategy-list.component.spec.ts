import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorBasicStrategyListComponent } from './collaborator-basic-strategy-list.component';

describe('CollaboratorBasicStrategyListComponent', () => {
  let component: CollaboratorBasicStrategyListComponent;
  let fixture: ComponentFixture<CollaboratorBasicStrategyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorBasicStrategyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorBasicStrategyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
