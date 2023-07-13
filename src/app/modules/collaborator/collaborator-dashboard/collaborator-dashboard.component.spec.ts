import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorDashboardComponent } from './collaborator-dashboard.component';


describe('CollaboratorDashboardComponent', () => {
  let component: CollaboratorDashboardComponent;
  let fixture: ComponentFixture<CollaboratorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
