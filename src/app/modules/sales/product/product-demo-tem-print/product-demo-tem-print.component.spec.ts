import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesProductDemoTemPrintComponent } from './product-demo-tem-print.component';


describe('WarehouseGoodsPrintComponent', () => {
  let component: SalesProductDemoTemPrintComponent;
  let fixture: ComponentFixture<SalesProductDemoTemPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesProductDemoTemPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesProductDemoTemPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
