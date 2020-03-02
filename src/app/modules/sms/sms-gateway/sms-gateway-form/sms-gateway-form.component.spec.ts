import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsGatewayFormComponent } from './sms-gateway-form.component';

describe('SmsGatewayFormComponent', () => {
  let component: SmsGatewayFormComponent;
  let fixture: ComponentFixture<SmsGatewayFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsGatewayFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsGatewayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
