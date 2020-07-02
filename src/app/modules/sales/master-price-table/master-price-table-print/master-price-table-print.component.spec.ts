import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPriceTablePrintComponent } from './master-price-table-print.component';

describe('MasterPriceTablePrintComponent', () => {
  let component: MasterPriceTablePrintComponent;
  let fixture: ComponentFixture<MasterPriceTablePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPriceTablePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPriceTablePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
