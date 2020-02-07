import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskTicketListComponent } from './helpdesk-ticket-list.component';

describe('HelpdeskTicketListComponent', () => {
  let component: HelpdeskTicketListComponent;
  let fixture: ComponentFixture<HelpdeskTicketListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskTicketListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskTicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
