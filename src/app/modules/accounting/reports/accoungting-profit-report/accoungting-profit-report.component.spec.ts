import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoungtingProfitReportComponent } from './accoungting-profit-report.component';

describe('AccoungtingProfitReportComponent', () => {
  let component: AccoungtingProfitReportComponent;
  let fixture: ComponentFixture<AccoungtingProfitReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccoungtingProfitReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccoungtingProfitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
