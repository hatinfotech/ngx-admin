import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTableFormComponent } from './price-table-form.component';

describe('PriceTableFormComponent', () => {
  let component: PriceTableFormComponent;
  let fixture: ComponentFixture<PriceTableFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTableFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
