import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePriceReportViewComponent } from './purchase-price-report-view.component';

describe('PurchasePriceReportViewComponent', () => {
  let component: PurchasePriceReportViewComponent;
  let fixture: ComponentFixture<PurchasePriceReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePriceReportViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePriceReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
