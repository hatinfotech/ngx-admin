import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfigBoardComponent } from './user-config-board.component';

describe('UserConfigBoardComponent', () => {
  let component: UserConfigBoardComponent;
  let fixture: ComponentFixture<UserConfigBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserConfigBoardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
