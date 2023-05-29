import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPriceTableUpdateNotePrintComponent } from './master-price-table-update-note-print.component';

describe('MasterPriceTableUpdateNotePrintComponent', () => {
  let component: MasterPriceTableUpdateNotePrintComponent;
  let fixture: ComponentFixture<MasterPriceTableUpdateNotePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPriceTableUpdateNotePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPriceTableUpdateNotePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
