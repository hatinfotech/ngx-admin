import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccCostClassificationPrintComponent } from './cost-classification-print.component';

describe('AccCostClassificationPrintComponent', () => {
  let component: AccCostClassificationPrintComponent;
  let fixture: ComponentFixture<AccCostClassificationPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccCostClassificationPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccCostClassificationPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
