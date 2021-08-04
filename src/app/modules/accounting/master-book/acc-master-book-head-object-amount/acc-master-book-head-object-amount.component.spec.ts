import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccMasterBookHeadObjectAmountComponent } from './acc-master-book-head-object-amount.component';

describe('AccMasterBookHeadObjectAmountComponent', () => {
  let component: AccMasterBookHeadObjectAmountComponent;
  let fixture: ComponentFixture<AccMasterBookHeadObjectAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccMasterBookHeadObjectAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccMasterBookHeadObjectAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
