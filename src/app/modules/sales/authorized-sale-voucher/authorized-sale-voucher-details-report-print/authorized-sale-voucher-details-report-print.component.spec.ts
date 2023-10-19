import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizedSaleVoucherDetailsReportPrintComponent } from './authorized-sale-voucher-details-report-print.component';


describe('AuthorizedSaleVoucherDetailsReportPrintComponent', () => {
  let component: AuthorizedSaleVoucherDetailsReportPrintComponent;
  let fixture: ComponentFixture<AuthorizedSaleVoucherDetailsReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedSaleVoucherDetailsReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedSaleVoucherDetailsReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
