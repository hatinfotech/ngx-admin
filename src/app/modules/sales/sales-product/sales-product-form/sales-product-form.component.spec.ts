import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleProductFormComponent } from './sales-product-form.component';

describe('SaleProductFormComponent', () => {
  let component: SaleProductFormComponent;
  let fixture: ComponentFixture<SaleProductFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleProductFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
