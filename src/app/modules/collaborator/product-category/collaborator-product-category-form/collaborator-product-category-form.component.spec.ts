import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorProductCategoryFormComponent } from './collaborator-product-category-form.component';

describe('CollaboratorProductCategoryFormComponent', () => {
  let component: CollaboratorProductCategoryFormComponent;
  let fixture: ComponentFixture<CollaboratorProductCategoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorProductCategoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorProductCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
