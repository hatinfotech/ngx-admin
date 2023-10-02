import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderFormComponent } from './production-order-form.component';

describe('ProductionOrderFormComponent', () => {
  let component: ProductionOrderFormComponent;
  let fixture: ComponentFixture<ProductionOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
