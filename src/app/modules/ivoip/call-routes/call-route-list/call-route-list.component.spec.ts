import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRouteListComponent } from './call-route-list.component';

describe('CallRouteListComponent', () => {
  let component: CallRouteListComponent;
  let fixture: ComponentFixture<CallRouteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallRouteListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallRouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
