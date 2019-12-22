import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterAgentListComponent } from './call-center-agent-list.component';

describe('CallCenterAgentListComponent', () => {
  let component: CallCenterAgentListComponent;
  let fixture: ComponentFixture<CallCenterAgentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallCenterAgentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterAgentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
