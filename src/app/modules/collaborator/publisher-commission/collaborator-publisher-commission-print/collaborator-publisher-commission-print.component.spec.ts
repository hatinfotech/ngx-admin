import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorPublisherCommissionPrintComponent } from './collaborator-publisher-commission-print.component';

describe('CollaboratorPublisherCommissionPrintComponent', () => {
  let component: CollaboratorPublisherCommissionPrintComponent;
  let fixture: ComponentFixture<CollaboratorPublisherCommissionPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorPublisherCommissionPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorPublisherCommissionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
