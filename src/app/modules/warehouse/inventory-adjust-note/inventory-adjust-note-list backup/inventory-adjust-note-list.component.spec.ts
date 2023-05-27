import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryAdjustNoteListComponent } from './inventory-adjust-note-list.component';

describe('WarehouseInventoryAdjustNoteListComponent', () => {
  let component: WarehouseInventoryAdjustNoteListComponent;
  let fixture: ComponentFixture<WarehouseInventoryAdjustNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseInventoryAdjustNoteListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseInventoryAdjustNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
