import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccBusinessFormComponent } from './acc-business-form.component';

describe('AccBusinessFormComponent', () => {
  let component: AccBusinessFormComponent;
  let fixture: ComponentFixture<AccBusinessFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccBusinessFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccBusinessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
