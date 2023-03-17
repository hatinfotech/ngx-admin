import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressSyncProfileListComponent } from './sync-profile-list.component';

describe('WordpressSyncProfileListComponent', () => {
  let component: WordpressSyncProfileListComponent;
  let fixture: ComponentFixture<WordpressSyncProfileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressSyncProfileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressSyncProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
