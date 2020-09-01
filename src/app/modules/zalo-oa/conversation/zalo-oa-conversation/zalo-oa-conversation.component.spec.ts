import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaloOaConversationComponent } from './zalo-oa-conversation.component';

describe('ZaloOaConversationComponent', () => {
  let component: ZaloOaConversationComponent;
  let fixture: ComponentFixture<ZaloOaConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaloOaConversationComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaloOaConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
