import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiDashboardComponent } from './kpi-dashboard.component';


describe('CollaboratorKpiDashboardComponent', () => {
  let component: CollaboratorKpiDashboardComponent;
  let fixture: ComponentFixture<CollaboratorKpiDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
