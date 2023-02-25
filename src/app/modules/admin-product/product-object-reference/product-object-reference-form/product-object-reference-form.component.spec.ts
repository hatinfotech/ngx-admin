import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductObjectReferenceFormComponent } from './product-object-reference-form.component';

describe('ProductObjectReferenceFormComponent', () => {
  let component: ProductObjectReferenceFormComponent;
  let fixture: ComponentFixture<ProductObjectReferenceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductObjectReferenceFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductObjectReferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
