import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleByCommissionVoucherReportPrintComponent } from './sale-by-commission-voucher-report-print.component';


describe('SaleByCommissionVoucherReportPrintComponent', () => {
  let component: SaleByCommissionVoucherReportPrintComponent;
  let fixture: ComponentFixture<SaleByCommissionVoucherReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleByCommissionVoucherReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleByCommissionVoucherReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
