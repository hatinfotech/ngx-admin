import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercePosOrderListComponent } from './commerce-pos-return-list.component';

describe('CommercePosOrderListComponent', () => {
  let component: CommercePosOrderListComponent;
  let fixture: ComponentFixture<CommercePosOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosOrderListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
