import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPmsFormComponent } from './ticket-pms-form.component';

describe('TicketPmsFormComponent', () => {
  let component: TicketPmsFormComponent;
  let fixture: ComponentFixture<TicketPmsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPmsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPmsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
