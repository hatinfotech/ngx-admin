import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeConfigBoardComponent } from './theme-config-board.component';

describe('ThemeConfigBoardComponent', () => {
  let component: ThemeConfigBoardComponent;
  let fixture: ComponentFixture<ThemeConfigBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeConfigBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeConfigBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
