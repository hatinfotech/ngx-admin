import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorProductCategoryListComponent } from './collaborator-product-category-list.component';

describe('CollaboratorProductCategoryListComponent', () => {
  let component: CollaboratorProductCategoryListComponent;
  let fixture: ComponentFixture<CollaboratorProductCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorProductCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorProductCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
