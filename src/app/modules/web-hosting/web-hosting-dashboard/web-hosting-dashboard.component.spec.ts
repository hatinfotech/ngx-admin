import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebHostingDashboardComponent } from './web-hosting-dashboard.component';

describe('WebHostingDashboardComponent', () => {
  let component: WebHostingDashboardComponent;
  let fixture: ComponentFixture<WebHostingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebHostingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebHostingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
