import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTableUpdateNoteListComponent } from './discount-table-update-note-list.component';

describe('DiscountTableUpdateNoteListComponent', () => {
  let component: DiscountTableUpdateNoteListComponent;
  let fixture: ComponentFixture<DiscountTableUpdateNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountTableUpdateNoteListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountTableUpdateNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
