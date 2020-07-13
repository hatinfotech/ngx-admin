import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlPlanListComponent } from './crawl-plan-list.component';

describe('CrawlPlanListComponent', () => {
  let component: CrawlPlanListComponent;
  let fixture: ComponentFixture<CrawlPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlPlanListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
