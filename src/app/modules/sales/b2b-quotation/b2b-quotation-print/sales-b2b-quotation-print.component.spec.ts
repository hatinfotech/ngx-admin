import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesB2bQuotationPrintComponent } from './sales-b2b-quotation-print.component';

describe('SalesB2bQuotationPrintComponent', () => {
  let component: SalesB2bQuotationPrintComponent;
  let fixture: ComponentFixture<SalesB2bQuotationPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesB2bQuotationPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesB2bQuotationPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
