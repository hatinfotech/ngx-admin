import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignNewContainerFormComponent } from './assign-new-containers-form.component';

describe('AssignCategoriesFormComponent', () => {
  let component: AssignNewContainerFormComponent;
  let fixture: ComponentFixture<AssignNewContainerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignNewContainerFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignNewContainerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
