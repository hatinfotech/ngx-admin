import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemConfigurationBoardComponent } from './system-configuration-board.component';

describe('SystemConfigurationBoardComponent', () => {
  let component: SystemConfigurationBoardComponent;
  let fixture: ComponentFixture<SystemConfigurationBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemConfigurationBoardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemConfigurationBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
