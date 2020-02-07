import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskTicketFormComponent } from './helpdesk-ticket-form.component';

describe('HelpdeskTicketFormComponent', () => {
  let component: HelpdeskTicketFormComponent;
  let fixture: ComponentFixture<HelpdeskTicketFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskTicketFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskTicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
