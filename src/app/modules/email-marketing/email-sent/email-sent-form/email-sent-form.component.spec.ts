import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSentFormComponent } from './email-sent-form.component';

describe('EmailSentFormComponent', () => {
  let component: EmailSentFormComponent;
  let fixture: ComponentFixture<EmailSentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
