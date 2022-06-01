import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercePosReturnFormComponent } from './commerce-pos-return-form.component';

describe('CommercePosReturnFormComponent', () => {
  let component: CommercePosReturnFormComponent;
  let fixture: ComponentFixture<CommercePosReturnFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosReturnFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosReturnFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
