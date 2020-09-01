import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParamFormComponent } from './system-param-form.component';

describe('SystemParamFormComponent', () => {
  let component: SystemParamFormComponent;
  let fixture: ComponentFixture<SystemParamFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParamFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
