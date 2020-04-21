import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortLinkListComponent } from './short-link-list.component';

describe('ShortLinkListComponent', () => {
  let component: ShortLinkListComponent;
  let fixture: ComponentFixture<ShortLinkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortLinkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
