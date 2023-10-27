import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifunctionalPurchaseFormComponent } from './multifunctional-purchase-form.component';

describe('MultifunctionalPurchaseFormComponent', () => {
  let component: MultifunctionalPurchaseFormComponent;
  let fixture: ComponentFixture<MultifunctionalPurchaseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultifunctionalPurchaseFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifunctionalPurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
