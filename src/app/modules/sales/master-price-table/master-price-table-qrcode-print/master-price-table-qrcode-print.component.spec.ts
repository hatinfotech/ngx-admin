import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterPriceTableQrCodePrintComponent } from './master-price-table-qrcode-print.component';


describe('WarehouseGoodsPrintComponent', () => {
  let component: MasterPriceTableQrCodePrintComponent;
  let fixture: ComponentFixture<MasterPriceTableQrCodePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPriceTableQrCodePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPriceTableQrCodePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
