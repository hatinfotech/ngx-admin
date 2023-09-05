import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesB2bQuotationListComponent } from './sales-b2b-quotation-list.component';

describe('SalesB2bQuotationListComponent', () => {
  let component: SalesB2bQuotationListComponent;
  let fixture: ComponentFixture<SalesB2bQuotationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesB2bQuotationListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesB2bQuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
