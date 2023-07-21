import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAddonStrategyListComponent } from './collaborator-addon-strategy-list.component';

describe('CollaboratorAddonStrategyListComponent', () => {
  let component: CollaboratorAddonStrategyListComponent;
  let fixture: ComponentFixture<CollaboratorAddonStrategyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAddonStrategyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAddonStrategyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
