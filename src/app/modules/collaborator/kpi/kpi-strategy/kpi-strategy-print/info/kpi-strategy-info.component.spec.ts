import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiStrategyPrintComponent } from '../kpi-strategy-print.component';


describe('CollaboratorKpiStrategyPrintComponent', () => {
  let component: CollaboratorKpiStrategyPrintComponent;
  let fixture: ComponentFixture<CollaboratorKpiStrategyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiStrategyPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiStrategyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
