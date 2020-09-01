import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSentStatsListComponent } from './sms-sent-stats-list.component';

describe('SmsSentStatsListComponent', () => {
  let component: SmsSentStatsListComponent;
  let fixture: ComponentFixture<SmsSentStatsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsSentStatsListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsSentStatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
