import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesB2bQuotationFormComponent } from './sales-b2b-quotation-form.component';

describe('SalesB2bQuotationFormComponent', () => {
  let component: SalesB2bQuotationFormComponent;
  let fixture: ComponentFixture<SalesB2bQuotationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesB2bQuotationFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesB2bQuotationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
