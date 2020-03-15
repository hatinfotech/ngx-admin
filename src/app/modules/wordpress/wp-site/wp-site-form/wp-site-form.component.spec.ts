import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WpSiteFormComponent } from './wp-site-form.component';

describe('WpSiteFormComponent', () => {
  let component: WpSiteFormComponent;
  let fixture: ComponentFixture<WpSiteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WpSiteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WpSiteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
