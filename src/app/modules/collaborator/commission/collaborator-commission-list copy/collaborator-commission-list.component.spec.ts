import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionListComponent } from './collaborator-commission-list.component';

describe('CollaboratorPublisherCommissionListComponent', () => {
  let component: CollaboratorCommissionListComponent;
  let fixture: ComponentFixture<CollaboratorCommissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
