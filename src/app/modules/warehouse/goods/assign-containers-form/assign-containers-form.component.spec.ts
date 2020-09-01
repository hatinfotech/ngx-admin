import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignContainerFormComponent } from './assign-containers-form.component';

describe('AssignCategoriesFormComponent', () => {
  let component: AssignContainerFormComponent;
  let fixture: ComponentFixture<AssignContainerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignContainerFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignContainerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
