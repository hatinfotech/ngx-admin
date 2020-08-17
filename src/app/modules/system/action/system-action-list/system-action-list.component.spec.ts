import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemActionListComponent } from './system-action-list.component';

describe('SystemActionListComponent', () => {
  let component: SystemActionListComponent;
  let fixture: ComponentFixture<SystemActionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemActionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
