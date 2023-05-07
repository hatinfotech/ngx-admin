import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListV1Component } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListV1Component;
  let fixture: ComponentFixture<ProductListV1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListV1Component ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
