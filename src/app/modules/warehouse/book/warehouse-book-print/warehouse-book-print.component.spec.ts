import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseBookPrintComponent } from './warehouse-book-print.component';

describe('WarehouseBookPrintComponent', () => {
  let component: WarehouseBookPrintComponent;
  let fixture: ComponentFixture<WarehouseBookPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseBookPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseBookPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
