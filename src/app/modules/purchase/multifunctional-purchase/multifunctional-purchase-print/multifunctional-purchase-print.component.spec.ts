import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifunctionalPurchasePrintComponent } from './multifunctional-purchase-print.component';

describe('MultifunctionalPurchasePrintComponent', () => {
  let component: MultifunctionalPurchasePrintComponent;
  let fixture: ComponentFixture<MultifunctionalPurchasePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultifunctionalPurchasePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifunctionalPurchasePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
