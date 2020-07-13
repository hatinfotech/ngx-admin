import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTableListComponent } from './price-table-list.component';

describe('PriceTableListComponent', () => {
  let component: PriceTableListComponent;
  let fixture: ComponentFixture<PriceTableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
