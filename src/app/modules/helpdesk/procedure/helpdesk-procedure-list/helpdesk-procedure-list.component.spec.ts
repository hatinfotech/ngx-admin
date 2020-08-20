import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskProcedureListComponent } from './helpdesk-procedure-list.component';

describe('HelpdeskProcedureListComponent', () => {
  let component: HelpdeskProcedureListComponent;
  let fixture: ComponentFixture<HelpdeskProcedureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskProcedureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskProcedureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
