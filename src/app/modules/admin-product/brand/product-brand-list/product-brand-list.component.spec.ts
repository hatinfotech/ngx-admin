import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBrandListComponent } from './product-brand-list.component';

describe('ProductBrandListComponent', () => {
  let component: ProductBrandListComponent;
  let fixture: ComponentFixture<ProductBrandListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBrandListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBrandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
