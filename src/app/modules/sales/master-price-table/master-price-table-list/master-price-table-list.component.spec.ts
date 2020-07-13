import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPriceTableListComponent } from './master-price-table-list.component';

describe('MasterPriceTableListComponent', () => {
  let component: MasterPriceTableListComponent;
  let fixture: ComponentFixture<MasterPriceTableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPriceTableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPriceTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
