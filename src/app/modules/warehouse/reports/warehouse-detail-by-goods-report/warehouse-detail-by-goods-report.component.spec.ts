import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDetailByGoodsReportComponent } from './warehouse-detail-by-goods-report.component';

describe('WarehouseDetailByObjectReportComponent', () => {
  let component: WarehouseDetailByGoodsReportComponent;
  let fixture: ComponentFixture<WarehouseDetailByGoodsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseDetailByGoodsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseDetailByGoodsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
