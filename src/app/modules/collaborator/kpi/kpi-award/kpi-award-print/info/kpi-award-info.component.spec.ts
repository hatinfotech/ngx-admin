import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiAwardInfoComponent } from './kpi-award-info.component';


describe('CollaboratorKpiAwardInfoComponent', () => {
  let component: CollaboratorKpiAwardInfoComponent;
  let fixture: ComponentFixture<CollaboratorKpiAwardInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiAwardInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiAwardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
