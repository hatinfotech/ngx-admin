import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccCostClassificationListComponent } from './cost-classification-list.component';

describe('AccCostClassificationListComponent', () => {
  let component: AccCostClassificationListComponent;
  let fixture: ComponentFixture<AccCostClassificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccCostClassificationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccCostClassificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
