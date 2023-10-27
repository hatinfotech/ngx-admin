import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifunctionalPurchaseTransportPrintComponent } from './multifunctional-purchase-transport-print.component';

describe('MultifunctionalPurchaseTransportPrintComponent', () => {
  let component: MultifunctionalPurchaseTransportPrintComponent;
  let fixture: ComponentFixture<MultifunctionalPurchaseTransportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultifunctionalPurchaseTransportPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifunctionalPurchaseTransportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
