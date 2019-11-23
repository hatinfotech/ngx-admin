import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTableViewComponent } from './price-table-view.component';

describe('PriceTableViewComponent', () => {
  let component: PriceTableViewComponent;
  let fixture: ComponentFixture<PriceTableViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTableViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
