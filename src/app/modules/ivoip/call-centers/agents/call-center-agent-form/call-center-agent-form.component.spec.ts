import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterAgentFormComponent } from './call-center-agent-form.component';

describe('CallCenterAgentFormComponent', () => {
  let component: CallCenterAgentFormComponent;
  let fixture: ComponentFixture<CallCenterAgentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallCenterAgentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterAgentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
