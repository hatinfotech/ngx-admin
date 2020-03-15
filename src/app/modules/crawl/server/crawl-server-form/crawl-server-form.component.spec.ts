import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlServerFormComponent } from './crawl-server-form.component';

describe('CrawlServerFormComponent', () => {
  let component: CrawlServerFormComponent;
  let fixture: ComponentFixture<CrawlServerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlServerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlServerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
