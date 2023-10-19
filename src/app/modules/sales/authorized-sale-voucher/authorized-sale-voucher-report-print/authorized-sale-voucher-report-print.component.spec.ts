import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizedSaleVoucherReportPrintComponent } from './authorized-sale-voucher-report-print.component';


describe('AuthorizedSaleVoucherReportPrintComponent', () => {
  let component: AuthorizedSaleVoucherReportPrintComponent;
  let fixture: ComponentFixture<AuthorizedSaleVoucherReportPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizedSaleVoucherReportPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedSaleVoucherReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
