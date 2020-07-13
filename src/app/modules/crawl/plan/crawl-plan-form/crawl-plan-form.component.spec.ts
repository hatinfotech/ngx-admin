import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlPlanFormComponent } from './crawl-plan-form.component';

describe('CrawlPlanFormComponent', () => {
  let component: CrawlPlanFormComponent;
  let fixture: ComponentFixture<CrawlPlanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlPlanFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
