import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercePosOrderPrintComponent } from './commerce-pos-order-print.component';

describe('CommercePosOrderPrintComponent', () => {
  let component: CommercePosOrderPrintComponent;
  let fixture: ComponentFixture<CommercePosOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosOrderPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
