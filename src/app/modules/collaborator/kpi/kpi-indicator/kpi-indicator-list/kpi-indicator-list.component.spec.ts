import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiIndicatorListComponent } from './kpi-indicator-list.component';


describe('CollaboratorKpiIndicatorListComponent', () => {
  let component: CollaboratorKpiIndicatorListComponent;
  let fixture: ComponentFixture<CollaboratorKpiIndicatorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiIndicatorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiIndicatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
