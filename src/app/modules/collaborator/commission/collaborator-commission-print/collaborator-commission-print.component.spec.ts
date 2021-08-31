import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionPrintComponent } from './collaborator-commission-print.component';

describe('CollaboratorPublisherCommissionPrintComponent', () => {
  let component: CollaboratorCommissionPrintComponent;
  let fixture: ComponentFixture<CollaboratorCommissionPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
