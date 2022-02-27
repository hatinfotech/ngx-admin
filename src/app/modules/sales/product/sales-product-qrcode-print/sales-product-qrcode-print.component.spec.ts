import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesProductQrCodePrintComponent } from './sales-product-qrcode-print.component';

describe('WarehouseGoodsContainerPrintComponent', () => {
  let component: SalesProductQrCodePrintComponent;
  let fixture: ComponentFixture<SalesProductQrCodePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesProductQrCodePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesProductQrCodePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
