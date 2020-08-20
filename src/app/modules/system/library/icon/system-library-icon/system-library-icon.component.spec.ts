import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLibraryIconComponent } from './system-library-icon.component';

describe('SystemLibraryIconComponent', () => {
  let component: SystemLibraryIconComponent;
  let fixture: ComponentFixture<SystemLibraryIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemLibraryIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLibraryIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
