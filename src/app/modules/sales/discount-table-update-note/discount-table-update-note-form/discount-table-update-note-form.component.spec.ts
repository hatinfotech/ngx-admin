import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTableUpdateNoteFormComponent } from './discount-table-update-note-form.component';

describe('DiscountTableUpdateNoteFormComponent', () => {
  let component: DiscountTableUpdateNoteFormComponent;
  let fixture: ComponentFixture<DiscountTableUpdateNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountTableUpdateNoteFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountTableUpdateNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
