import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionPaymentPrintComponent } from './collaborator-commission-payment-print.component';

describe('CollaboratorPublisherCommissionPaymentPrintComponent', () => {
  let component: CollaboratorCommissionPaymentPrintComponent;
  let fixture: ComponentFixture<CollaboratorCommissionPaymentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionPaymentPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionPaymentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
