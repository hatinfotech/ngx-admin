import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressSyncProfileFormComponent } from './sync-profile-form.component';

describe('WordpressSyncProfileFormComponent', () => {
  let component: WordpressSyncProfileFormComponent;
  let fixture: ComponentFixture<WordpressSyncProfileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressSyncProfileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressSyncProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
