import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseFindOrderTempPrintComponent } from './warehouse-find-order-temp-print.component';


describe('WarehouseFindOrderTempPrintComponent', () => {
  let component: WarehouseFindOrderTempPrintComponent;
  let fixture: ComponentFixture<WarehouseFindOrderTempPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseFindOrderTempPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseFindOrderTempPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
