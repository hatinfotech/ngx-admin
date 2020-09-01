import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskActionFormComponent } from './helpdesk-action-form.component';

describe('HelpdeskActionFormComponent', () => {
  let component: HelpdeskActionFormComponent;
  let fixture: ComponentFixture<HelpdeskActionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskActionFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskActionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
