import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSentFormComponent } from './sms-sent-form.component';

describe('SmsSentFormComponent', () => {
  let component: SmsSentFormComponent;
  let fixture: ComponentFixture<SmsSentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsSentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsSentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
