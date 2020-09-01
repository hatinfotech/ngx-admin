import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskProcedureFormComponent } from './helpdesk-procedure-form.component';

describe('HelpdeskProcedureFormComponent', () => {
  let component: HelpdeskProcedureFormComponent;
  let fixture: ComponentFixture<HelpdeskProcedureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskProcedureFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskProcedureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
