import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlDashboardComponent } from './crawl-dashboard.component';

describe('CrawlDashboardComponent', () => {
  let component: CrawlDashboardComponent;
  let fixture: ComponentFixture<CrawlDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
