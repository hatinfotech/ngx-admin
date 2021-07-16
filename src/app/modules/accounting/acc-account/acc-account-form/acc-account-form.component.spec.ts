import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccAccountFormComponent } from './acc-account-form.component';

describe('AccAccountFormComponent', () => {
  let component: AccAccountFormComponent;
  let fixture: ComponentFixture<AccAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccAccountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
