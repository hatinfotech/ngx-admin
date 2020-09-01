import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExtensionListComponent } from './user-extension-list.component';

describe('UserExtensionListComponent', () => {
  let component: UserExtensionListComponent;
  let fixture: ComponentFixture<UserExtensionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserExtensionListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExtensionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
