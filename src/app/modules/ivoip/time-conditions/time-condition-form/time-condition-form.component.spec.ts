import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeConditionFormComponent } from './time-condition-form.component';

describe('TimeConditionFormComponent', () => {
  let component: TimeConditionFormComponent;
  let fixture: ComponentFixture<TimeConditionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeConditionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeConditionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
