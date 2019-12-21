import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRouteFormComponent } from './call-route-form.component';

describe('CallRouteFormComponent', () => {
  let component: CallRouteFormComponent;
  let fixture: ComponentFixture<CallRouteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallRouteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallRouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
