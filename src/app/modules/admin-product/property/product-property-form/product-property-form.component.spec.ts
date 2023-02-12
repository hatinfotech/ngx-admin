import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPropertyFormComponent } from './product-property-form.component';

describe('ProductPropertyFormComponent', () => {
  let component: ProductPropertyFormComponent;
  let fixture: ComponentFixture<ProductPropertyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPropertyFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
