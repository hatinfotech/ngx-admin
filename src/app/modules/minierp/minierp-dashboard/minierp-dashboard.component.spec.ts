import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinierpDashboardComponent } from './minierp-dashboard.component';

describe('MinierpDashboardComponent', () => {
  let component: MinierpDashboardComponent;
  let fixture: ComponentFixture<MinierpDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinierpDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinierpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
