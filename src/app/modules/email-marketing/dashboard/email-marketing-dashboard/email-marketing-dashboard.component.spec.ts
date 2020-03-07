import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMarketingDashboardComponent } from './email-marketing-dashboard.component';

describe('EmailMarketingDashboardComponent', () => {
  let component: EmailMarketingDashboardComponent;
  let fixture: ComponentFixture<EmailMarketingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailMarketingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailMarketingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
