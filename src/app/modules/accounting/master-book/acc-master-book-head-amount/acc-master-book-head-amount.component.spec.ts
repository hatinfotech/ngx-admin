import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccMasterBookHeadAmountComponent } from './acc-master-book-head-amount.component';

describe('AccMasterBookHeadAmountComponent', () => {
  let component: AccMasterBookHeadAmountComponent;
  let fixture: ComponentFixture<AccMasterBookHeadAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccMasterBookHeadAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccMasterBookHeadAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
