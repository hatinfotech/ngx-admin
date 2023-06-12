import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDetailByObjectReportAgComponent } from './detail-by-object-report-ag.component';

describe('WarehouseDetailByObjectReportAgComponent', () => {
  let component: WarehouseDetailByObjectReportAgComponent;
  let fixture: ComponentFixture<WarehouseDetailByObjectReportAgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseDetailByObjectReportAgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseDetailByObjectReportAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
