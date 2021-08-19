import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorOrderPrintComponent } from './collaborator-order-print.component';

describe('CollaboratorOrderPrintComponent', () => {
  let component: CollaboratorOrderPrintComponent;
  let fixture: ComponentFixture<CollaboratorOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorOrderPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
