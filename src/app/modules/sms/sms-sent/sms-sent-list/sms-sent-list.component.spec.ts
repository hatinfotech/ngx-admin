import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSentListComponent } from './sms-sent-list.component';

describe('SmsSentListComponent', () => {
  let component: SmsSentListComponent;
  let fixture: ComponentFixture<SmsSentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsSentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsSentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
