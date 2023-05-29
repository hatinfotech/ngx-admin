import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPriceTableUpdateNoteListComponent } from './master-price-table-update-note-list.component';

describe('MasterPriceTableUpdateNoteListComponent', () => {
  let component: MasterPriceTableUpdateNoteListComponent;
  let fixture: ComponentFixture<MasterPriceTableUpdateNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPriceTableUpdateNoteListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPriceTableUpdateNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
