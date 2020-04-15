import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsContentListComponent } from './ads-content-list.component';

describe('AdsContentListComponent', () => {
  let component: AdsContentListComponent;
  let fixture: ComponentFixture<AdsContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
