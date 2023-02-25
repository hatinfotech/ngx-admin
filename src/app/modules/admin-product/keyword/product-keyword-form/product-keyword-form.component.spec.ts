import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductKeywordFormComponent } from './product-keyword-form.component';

describe('ProductKeywordFormComponent', () => {
  let component: ProductKeywordFormComponent;
  let fixture: ComponentFixture<ProductKeywordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductKeywordFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductKeywordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
