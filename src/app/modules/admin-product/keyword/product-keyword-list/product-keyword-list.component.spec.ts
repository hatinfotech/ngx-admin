import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductKeywordListComponent } from './product-keyword-list.component';

describe('ProductKeywordListComponent', () => {
  let component: ProductKeywordListComponent;
  let fixture: ComponentFixture<ProductKeywordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductKeywordListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductKeywordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
