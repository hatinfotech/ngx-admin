import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsPhoneNumberListComponent } from './sms-phone-number-list.component';

describe('SmsPhoneNumberListComponent', () => {
  let component: SmsPhoneNumberListComponent;
  let fixture: ComponentFixture<SmsPhoneNumberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsPhoneNumberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsPhoneNumberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
