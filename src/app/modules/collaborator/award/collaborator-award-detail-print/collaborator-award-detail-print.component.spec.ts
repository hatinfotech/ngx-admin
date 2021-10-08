import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorAwardPrintComponent } from './collaborator-award-detail-print.component';

describe('CollaboratorPublisherAwardPrintComponent', () => {
  let component: CollaboratorAwardPrintComponent;
  let fixture: ComponentFixture<CollaboratorAwardPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorAwardPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorAwardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
