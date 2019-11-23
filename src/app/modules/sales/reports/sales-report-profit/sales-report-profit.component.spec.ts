import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportProfitComponent } from './sales-report-profit.component';

describe('SalesReportProfitComponent', () => {
  let component: SalesReportProfitComponent;
  let fixture: ComponentFixture<SalesReportProfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReportProfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReportProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
