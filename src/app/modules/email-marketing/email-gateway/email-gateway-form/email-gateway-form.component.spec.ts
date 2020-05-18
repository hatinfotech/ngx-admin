import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGatewayFormComponent } from './email-gateway-form.component';

describe('EmailGatewayFormComponent', () => {
  let component: EmailGatewayFormComponent;
  let fixture: ComponentFixture<EmailGatewayFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailGatewayFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGatewayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
