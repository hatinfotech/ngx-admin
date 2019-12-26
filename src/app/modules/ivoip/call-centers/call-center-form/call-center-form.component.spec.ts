import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterFormComponent } from './call-center-form.component';

describe('CallCenterFormComponent', () => {
  let component: CallCenterFormComponent;
  let fixture: ComponentFixture<CallCenterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallCenterFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
