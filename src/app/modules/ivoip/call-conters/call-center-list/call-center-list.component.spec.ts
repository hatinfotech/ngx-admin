import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterListComponent } from './call-center-list.component';

describe('CallCenterListComponent', () => {
  let component: CallCenterListComponent;
  let fixture: ComponentFixture<CallCenterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallCenterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
