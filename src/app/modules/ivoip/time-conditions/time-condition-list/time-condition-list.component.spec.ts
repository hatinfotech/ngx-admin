import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeConditionListComponent } from './time-condition-list.component';

describe('TimeConditionListComponent', () => {
  let component: TimeConditionListComponent;
  let fixture: ComponentFixture<TimeConditionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeConditionListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeConditionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
