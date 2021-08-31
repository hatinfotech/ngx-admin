import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionPaymentFormComponent } from './collaborator-commission-payment-form.component';

describe('CollaboratorPublisherCommissionPaymentFormComponent', () => {
  let component: CollaboratorCommissionPaymentFormComponent;
  let fixture: ComponentFixture<CollaboratorCommissionPaymentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionPaymentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
