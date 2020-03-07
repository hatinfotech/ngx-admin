import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGatewayListComponent } from './email-gateway-list.component';

describe('EmailGatewayListComponent', () => {
  let component: EmailGatewayListComponent;
  let fixture: ComponentFixture<EmailGatewayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailGatewayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGatewayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
