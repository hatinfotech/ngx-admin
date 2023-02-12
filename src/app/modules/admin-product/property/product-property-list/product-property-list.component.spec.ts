import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPropertyListComponent } from './product-property-list.component';

describe('ProductPropertyListComponent', () => {
  let component: ProductPropertyListComponent;
  let fixture: ComponentFixture<ProductPropertyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPropertyListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
