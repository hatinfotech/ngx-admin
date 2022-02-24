import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercePosOrderFormComponent } from './commerce-pos-order-form.component';

describe('CommercePosOrderFormComponent', () => {
  let component: CommercePosOrderFormComponent;
  let fixture: ComponentFixture<CommercePosOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosOrderFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
