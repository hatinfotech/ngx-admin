import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReportComponent } from './price-report.component';

describe('PriceReportComponent', () => {
  let component: PriceReportComponent;
  let fixture: ComponentFixture<PriceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReportComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
