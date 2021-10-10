import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityNotificationComponent } from './activity-notification.component';

describe('ActivityNotificationComponent', () => {
  let component: ActivityNotificationComponent;
  let fixture: ComponentFixture<ActivityNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
