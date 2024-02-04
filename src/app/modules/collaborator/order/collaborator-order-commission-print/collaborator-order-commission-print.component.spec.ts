import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorOrderCommissionPrintComponent } from './collaborator-order-commission-print.component';

describe('CollaboratorOrderCommissionPrintComponent', () => {
  let component: CollaboratorOrderCommissionPrintComponent;
  let fixture: ComponentFixture<CollaboratorOrderCommissionPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorOrderCommissionPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorOrderCommissionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
