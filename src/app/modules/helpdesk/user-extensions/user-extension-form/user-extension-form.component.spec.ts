import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExtensionFormComponent } from './user-extension-form.component';

describe('UserExtensionFormComponent', () => {
  let component: UserExtensionFormComponent;
  let fixture: ComponentFixture<UserExtensionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserExtensionFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExtensionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
