import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiGroupFormComponent } from './kpi-strategy-form.component';


describe('CollaboratorKpiGroupFormComponent', () => {
  let component: CollaboratorKpiGroupFormComponent;
  let fixture: ComponentFixture<CollaboratorKpiGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
