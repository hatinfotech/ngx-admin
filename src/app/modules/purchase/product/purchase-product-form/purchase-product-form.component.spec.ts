import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseProductFormComponent } from './purchase-product-form.component';

describe('PurchaseProductFormComponent', () => {
  let component: PurchaseProductFormComponent;
  let fixture: ComponentFixture<PurchaseProductFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseProductFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
