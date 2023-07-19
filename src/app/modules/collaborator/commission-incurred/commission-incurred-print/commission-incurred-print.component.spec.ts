import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCommissionIncurredPrintComponent } from './commission-incurred-print.component';

describe('CollaboratorCommissionIncurredPrintComponent', () => {
  let component: CollaboratorCommissionIncurredPrintComponent;
  let fixture: ComponentFixture<CollaboratorCommissionIncurredPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorCommissionIncurredPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorCommissionIncurredPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
