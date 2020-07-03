import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCategoriesFormComponent } from './assign-categories-form.component';

describe('AssignCategoriesFormComponent', () => {
  let component: AssignCategoriesFormComponent;
  let fixture: ComponentFixture<AssignCategoriesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCategoriesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCategoriesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
