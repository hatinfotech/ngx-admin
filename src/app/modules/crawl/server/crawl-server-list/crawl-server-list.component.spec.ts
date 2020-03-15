import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlServerListComponent } from './crawl-server-list.component';

describe('CrawlServerListComponent', () => {
  let component: CrawlServerListComponent;
  let fixture: ComponentFixture<CrawlServerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlServerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlServerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
