import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsPhoneNumberFormComponent } from './sms-phone-number-form.component';

describe('SmsPhoneNumberFormComponent', () => {
  let component: SmsPhoneNumberFormComponent;
  let fixture: ComponentFixture<SmsPhoneNumberFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsPhoneNumberFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsPhoneNumberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
