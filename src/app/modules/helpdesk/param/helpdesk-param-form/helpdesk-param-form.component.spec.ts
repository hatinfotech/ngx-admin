import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskParamFormComponent } from './helpdesk-param-form.component';

describe('HelpdeskParamFormComponent', () => {
  let component: HelpdeskParamFormComponent;
  let fixture: ComponentFixture<HelpdeskParamFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskParamFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskParamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
