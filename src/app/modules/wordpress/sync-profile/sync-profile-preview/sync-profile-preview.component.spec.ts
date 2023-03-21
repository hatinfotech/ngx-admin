import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressSyncProfilePreviewComponent } from './sync-profile-preview.component';

describe('WordpressSyncProfileFormComponent', () => {
  let component: WordpressSyncProfilePreviewComponent;
  let fixture: ComponentFixture<WordpressSyncProfilePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressSyncProfilePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressSyncProfilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
