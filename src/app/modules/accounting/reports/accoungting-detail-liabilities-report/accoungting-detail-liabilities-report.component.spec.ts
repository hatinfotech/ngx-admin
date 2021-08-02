import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoungtingDetailLiabilitiesReportComponent } from './accoungting-detail-liabilities-report.component';

describe('AccoungtingDetailLiabilitiesReportComponent', () => {
  let component: AccoungtingDetailLiabilitiesReportComponent;
  let fixture: ComponentFixture<AccoungtingDetailLiabilitiesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccoungtingDetailLiabilitiesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccoungtingDetailLiabilitiesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
