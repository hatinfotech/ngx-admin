import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleProductListComponent } from './sales-product-list.component';

describe('SaleProductListComponent', () => {
  let component: SaleProductListComponent;
  let fixture: ComponentFixture<SaleProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleProductListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
