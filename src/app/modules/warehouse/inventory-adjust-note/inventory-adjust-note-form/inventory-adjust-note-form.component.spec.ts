import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryAdjustNoteFormComponent } from './inventory-adjust-note-form.component';

describe('WarehouseInventoryAdjustNoteFormComponent', () => {
  let component: WarehouseInventoryAdjustNoteFormComponent;
  let fixture: ComponentFixture<WarehouseInventoryAdjustNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseInventoryAdjustNoteFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseInventoryAdjustNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
