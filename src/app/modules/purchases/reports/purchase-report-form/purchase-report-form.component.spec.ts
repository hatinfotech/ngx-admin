import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportFormComponent } from './purchase-report-form.component';

describe('PurchaseReportFormComponent', () => {
  let component: PurchaseReportFormComponent;
  let fixture: ComponentFixture<PurchaseReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReportFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
