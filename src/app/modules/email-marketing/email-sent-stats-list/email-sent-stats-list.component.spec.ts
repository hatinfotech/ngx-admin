import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSentStatsListComponent } from './email-sent-stats-list.component';

describe('EmailSentStatsListComponent', () => {
  let component: EmailSentStatsListComponent;
  let fixture: ComponentFixture<EmailSentStatsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSentStatsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSentStatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
