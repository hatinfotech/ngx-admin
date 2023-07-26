import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiStrategyListComponent } from './kpi-strategy-list.component';


describe('CollaboratorKpiStrategyListComponent', () => {
  let component: CollaboratorKpiStrategyListComponent;
  let fixture: ComponentFixture<CollaboratorKpiStrategyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiStrategyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiStrategyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
