import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemActionFormComponent } from './system-action-form.component';

describe('SystemActionFormComponent', () => {
  let component: SystemActionFormComponent;
  let fixture: ComponentFixture<SystemActionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemActionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemActionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
