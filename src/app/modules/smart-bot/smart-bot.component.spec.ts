import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartBotComponent } from './smart-bot.component';

describe('SmartBotComponent', () => {
  let component: SmartBotComponent;
  let fixture: ComponentFixture<SmartBotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartBotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
