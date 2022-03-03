import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercePosBillPrintComponent } from './commerce-pos-bill-print.component';


describe('WarehouseGoodsPrintComponent', () => {
  let component: CommercePosBillPrintComponent;
  let fixture: ComponentFixture<CommercePosBillPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosBillPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
