import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRouteFormComponent } from './system-route-form.component';

describe('SystemRouteFormComponent', () => {
  let component: SystemRouteFormComponent;
  let fixture: ComponentFixture<SystemRouteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemRouteFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
