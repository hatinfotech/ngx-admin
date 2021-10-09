import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionDetailPrintComponent } from './collaborator-commission-detail-print.component';

describe('CollaboratorPublisherCommissionPrintComponent', () => {
  let component: CollaboratorCommissionDetailPrintComponent;
  let fixture: ComponentFixture<CollaboratorCommissionDetailPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionDetailPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionDetailPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
