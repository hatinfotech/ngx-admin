import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportListComponent } from './purchase-report-list.component';

describe('PurchaseReportListComponent', () => {
  let component: PurchaseReportListComponent;
  let fixture: ComponentFixture<PurchaseReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReportListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
