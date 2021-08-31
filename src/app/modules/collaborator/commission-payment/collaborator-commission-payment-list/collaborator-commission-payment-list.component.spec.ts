import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionPaymentListComponent } from './collaborator-commission-payment-list.component';

describe('CollaboratorPublisherCommissionPaymentListComponent', () => {
  let component: CollaboratorCommissionPaymentListComponent;
  let fixture: ComponentFixture<CollaboratorCommissionPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
