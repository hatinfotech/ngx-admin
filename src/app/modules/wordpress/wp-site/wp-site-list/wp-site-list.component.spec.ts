import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WpSiteListComponent } from './wp-site-list.component';

describe('WpSiteListComponent', () => {
  let component: WpSiteListComponent;
  let fixture: ComponentFixture<WpSiteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WpSiteListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WpSiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
