import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDiscountTableComponent } from './discount-table.component';

describe('WordpressProductListComponent', () => {
  let component: SalesDiscountTableComponent;
  let fixture: ComponentFixture<SalesDiscountTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesDiscountTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDiscountTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
