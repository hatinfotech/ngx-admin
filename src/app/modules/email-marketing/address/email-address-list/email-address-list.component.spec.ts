import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAddressListComponent } from './email-address-list.component';

describe('EmailAddressListComponent', () => {
  let component: EmailAddressListComponent;
  let fixture: ComponentFixture<EmailAddressListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAddressListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
