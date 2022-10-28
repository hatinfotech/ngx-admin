import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAddonStrategyPublisherFormComponent } from './collaborator-addon-strategy-publisher-form.component';

describe('CollaboratorAddonStrategyPublisherFormComponent', () => {
  let component: CollaboratorAddonStrategyPublisherFormComponent;
  let fixture: ComponentFixture<CollaboratorAddonStrategyPublisherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAddonStrategyPublisherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAddonStrategyPublisherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
