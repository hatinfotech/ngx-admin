import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskRouteFormComponent } from './helpdesk-route-form.component';

describe('HelpdeskRouteFormComponent', () => {
  let component: HelpdeskRouteFormComponent;
  let fixture: ComponentFixture<HelpdeskRouteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskRouteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskRouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
