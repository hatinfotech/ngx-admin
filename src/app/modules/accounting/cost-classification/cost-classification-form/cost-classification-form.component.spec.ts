import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccCostClassificationFormComponent } from './cost-classification-form.component';

describe('AccCostClassificationFormComponent', () => {
  let component: AccCostClassificationFormComponent;
  let fixture: ComponentFixture<AccCostClassificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccCostClassificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccCostClassificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
