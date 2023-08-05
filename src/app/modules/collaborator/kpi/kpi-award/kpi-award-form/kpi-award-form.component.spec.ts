import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiAwardFormComponent } from './kpi-award-form.component';


describe('CollaboratorKpiAwardFormComponent', () => {
  let component: CollaboratorKpiAwardFormComponent;
  let fixture: ComponentFixture<CollaboratorKpiAwardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiAwardFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiAwardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
