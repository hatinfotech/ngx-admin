import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercePosPaymnentPrintComponent } from './commerce-pos-payment-print.component';


describe('WarehouseGoodsPrintComponent', () => {
  let component: CommercePosPaymnentPrintComponent;
  let fixture: ComponentFixture<CommercePosPaymnentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosPaymnentPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosPaymnentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
