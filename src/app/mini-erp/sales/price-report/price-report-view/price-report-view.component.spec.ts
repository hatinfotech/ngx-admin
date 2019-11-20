import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceReportViewComponent } from './price-report-view.component';

describe('ViewComponent', () => {
  let component: PriceReportViewComponent;
  let fixture: ComponentFixture<PriceReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceReportViewComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
