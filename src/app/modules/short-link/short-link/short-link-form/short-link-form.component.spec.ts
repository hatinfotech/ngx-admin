import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortLinkFormComponent } from './short-link-form.component';

describe('ShortLinkFormComponent', () => {
  let component: ShortLinkFormComponent;
  let fixture: ComponentFixture<ShortLinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortLinkFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
