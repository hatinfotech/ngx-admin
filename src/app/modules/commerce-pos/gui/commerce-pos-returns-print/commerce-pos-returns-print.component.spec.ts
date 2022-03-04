import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercePosReturnsPrintComponent } from './commerce-pos-returns-print.component';


describe('WarehouseGoodsPrintComponent', () => {
  let component: CommercePosReturnsPrintComponent;
  let fixture: ComponentFixture<CommercePosReturnsPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosReturnsPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosReturnsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
