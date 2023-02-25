import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductObjectReferenceListComponent } from './product-object-reference-list.component';

describe('ProductObjectReferenceListComponent', () => {
  let component: ProductObjectReferenceListComponent;
  let fixture: ComponentFixture<ProductObjectReferenceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductObjectReferenceListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductObjectReferenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
