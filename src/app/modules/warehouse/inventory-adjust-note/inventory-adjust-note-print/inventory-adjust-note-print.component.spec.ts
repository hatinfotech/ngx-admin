import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryAdjustNotePrintComponent } from './inventory-adjust-note-print.component';

describe('WarehouseInventoryAdjustNotePrintComponent', () => {
  let component: WarehouseInventoryAdjustNotePrintComponent;
  let fixture: ComponentFixture<WarehouseInventoryAdjustNotePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseInventoryAdjustNotePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseInventoryAdjustNotePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
