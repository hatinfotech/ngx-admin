import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReportFormComponent } from './price-report-form.component';

describe('FormComponent', () => {
  let component: PriceReportFormComponent;
  let fixture: ComponentFixture<PriceReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReportFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
