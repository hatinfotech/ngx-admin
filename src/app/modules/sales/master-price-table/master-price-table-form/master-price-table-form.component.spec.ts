import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPriceTableFormComponent } from './master-price-table-form.component';

describe('MasterPriceTableFormComponent', () => {
  let component: MasterPriceTableFormComponent;
  let fixture: ComponentFixture<MasterPriceTableFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPriceTableFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPriceTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
