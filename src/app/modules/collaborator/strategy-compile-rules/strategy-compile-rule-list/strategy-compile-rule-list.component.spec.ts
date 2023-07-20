import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorStrategyCompileRuleListComponent } from './strategy-compile-rule-list.component';

describe('CollaboratorOrderListComponent', () => {
  let component: CollaboratorStrategyCompileRuleListComponent;
  let fixture: ComponentFixture<CollaboratorStrategyCompileRuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorStrategyCompileRuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorStrategyCompileRuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
