import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorProductFormComponent } from './collaborator-basic-strategy-product-form.component';

describe('CollaboratorProductFormComponent', () => {
  let component: CollaboratorProductFormComponent;
  let fixture: ComponentFixture<CollaboratorProductFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorProductFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
