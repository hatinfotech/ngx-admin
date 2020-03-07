import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSentListComponent } from './email-sent-list.component';

describe('EmailSentListComponent', () => {
  let component: EmailSentListComponent;
  let fixture: ComponentFixture<EmailSentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
