import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoungtingDetailByObjectReportComponent } from './accoungting-detail-by-object-report.component';

describe('AccoungtingDetailByObjectReportComponent', () => {
  let component: AccoungtingDetailByObjectReportComponent;
  let fixture: ComponentFixture<AccoungtingDetailByObjectReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccoungtingDetailByObjectReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccoungtingDetailByObjectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
