import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocaleConfigComponent } from './user-locale-config.component';

describe('UserLocaleConfigComponent', () => {
  let component: UserLocaleConfigComponent;
  let fixture: ComponentFixture<UserLocaleConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLocaleConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLocaleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
