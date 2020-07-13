import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParameterFormComponent } from './system-parameter-form.component';

describe('SystemParameterFormComponent', () => {
  let component: SystemParameterFormComponent;
  let fixture: ComponentFixture<SystemParameterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParameterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
