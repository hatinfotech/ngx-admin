import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifunctionalPurchaseListComponent } from './multifunctional-purchase-list.component';

describe('MultifunctionalPurchaseListComponent', () => {
  let component: MultifunctionalPurchaseListComponent;
  let fixture: ComponentFixture<MultifunctionalPurchaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultifunctionalPurchaseListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifunctionalPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
