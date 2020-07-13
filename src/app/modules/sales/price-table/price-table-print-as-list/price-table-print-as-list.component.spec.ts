import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTablePrintAsListComponent } from './price-table-print-as-list.component';

describe('PriceTablePrintAsListComponent', () => {
  let component: PriceTablePrintAsListComponent;
  let fixture: ComponentFixture<PriceTablePrintAsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTablePrintAsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTablePrintAsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
