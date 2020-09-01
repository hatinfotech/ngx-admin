import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRouteListComponent } from './system-route-list.component';

describe('SystemRouteListComponent', () => {
  let component: SystemRouteListComponent;
  let fixture: ComponentFixture<SystemRouteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemRouteListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
