import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAddressFormComponent } from './email-address-form.component';

describe('EmailAddressFormComponent', () => {
  let component: EmailAddressFormComponent;
  let fixture: ComponentFixture<EmailAddressFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAddressFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
