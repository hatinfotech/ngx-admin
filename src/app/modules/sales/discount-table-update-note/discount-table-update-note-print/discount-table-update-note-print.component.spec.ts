import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTableUpdateNotePrintComponent } from './discount-table-update-note-print.component';

describe('DiscountTableUpdateNotePrintComponent', () => {
  let component: DiscountTableUpdateNotePrintComponent;
  let fixture: ComponentFixture<DiscountTableUpdateNotePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountTableUpdateNotePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountTableUpdateNotePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
