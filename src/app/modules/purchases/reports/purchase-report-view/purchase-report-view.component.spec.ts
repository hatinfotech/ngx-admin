import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportViewComponent } from './purchase-report-view.component';

describe('PurchaseReportViewComponent', () => {
  let component: PurchaseReportViewComponent;
  let fixture: ComponentFixture<PurchaseReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
