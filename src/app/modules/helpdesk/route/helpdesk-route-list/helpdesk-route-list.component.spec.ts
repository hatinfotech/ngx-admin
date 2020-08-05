import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskRouteListComponent } from './helpdesk-route-list.component';

describe('HelpdeskRouteListComponent', () => {
  let component: HelpdeskRouteListComponent;
  let fixture: ComponentFixture<HelpdeskRouteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskRouteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskRouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
