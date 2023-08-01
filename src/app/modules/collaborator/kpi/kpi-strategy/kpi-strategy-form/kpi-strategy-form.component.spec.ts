import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiStrategyFormComponent } from './kpi-strategy-form.component';


describe('CollaboratorKpiStrategyFormComponent', () => {
  let component: CollaboratorKpiStrategyFormComponent;
  let fixture: ComponentFixture<CollaboratorKpiStrategyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiStrategyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiStrategyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
