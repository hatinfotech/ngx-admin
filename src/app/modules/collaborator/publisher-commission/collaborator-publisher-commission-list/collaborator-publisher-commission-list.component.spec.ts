import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherCommissionListComponent } from './collaborator-publisher-commission-list.component';

describe('CollaboratorPublisherCommissionListComponent', () => {
  let component: CollaboratorPublisherCommissionListComponent;
  let fixture: ComponentFixture<CollaboratorPublisherCommissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherCommissionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherCommissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
