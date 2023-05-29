import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPriceTableUpdateNoteFormComponent } from './master-price-table-update-note-form.component';

describe('MasterPriceTableUpdateNoteFormComponent', () => {
  let component: MasterPriceTableUpdateNoteFormComponent;
  let fixture: ComponentFixture<MasterPriceTableUpdateNoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPriceTableUpdateNoteFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPriceTableUpdateNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
