import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinierpControllerDashboardComponent } from './minierp-controller-dashboard.component';

describe('MinierpControllerDashboardComponent', () => {
  let component: MinierpControllerDashboardComponent;
  let fixture: ComponentFixture<MinierpControllerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinierpControllerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinierpControllerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
