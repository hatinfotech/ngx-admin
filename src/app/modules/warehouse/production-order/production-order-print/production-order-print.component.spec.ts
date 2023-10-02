import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderPrintComponent } from './production-order-print.component';

describe('ProductionOrderPrintComponent', () => {
  let component: ProductionOrderPrintComponent;
  let fixture: ComponentFixture<ProductionOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
