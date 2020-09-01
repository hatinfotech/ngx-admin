import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTablePrintComponent } from './price-table-print.component';

describe('PriceTablePrintComponent', () => {
  let component: PriceTablePrintComponent;
  let fixture: ComponentFixture<PriceTablePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTablePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTablePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
