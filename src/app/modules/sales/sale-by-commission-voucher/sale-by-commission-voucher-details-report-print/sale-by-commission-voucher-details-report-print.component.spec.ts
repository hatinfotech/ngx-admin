import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleByCommissionVoucherDetailsReportPrintComponent } from './sale-by-commission-voucher-details-report-print.component';


describe('SaleByCommissionVoucherDetailsReportPrintComponent', () => {
  let component: SaleByCommissionVoucherDetailsReportPrintComponent;
  let fixture: ComponentFixture<SaleByCommissionVoucherDetailsReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleByCommissionVoucherDetailsReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleByCommissionVoucherDetailsReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
