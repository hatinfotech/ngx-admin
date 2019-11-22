import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReportListComponent } from './price-report-list.component';

describe('ListComponent', () => {
  let component: PriceReportListComponent;
  let fixture: ComponentFixture<PriceReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReportListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
