import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsGatewayListComponent } from './sms-gateway-list.component';

describe('SmsGatewayListComponent', () => {
  let component: SmsGatewayListComponent;
  let fixture: ComponentFixture<SmsGatewayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsGatewayListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsGatewayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
