import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorEmployeeGroupFormComponent } from './employee-group-form.component';


describe('CollaboratorEmployeeGroupFormComponent', () => {
  let component: CollaboratorEmployeeGroupFormComponent;
  let fixture: ComponentFixture<CollaboratorEmployeeGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorEmployeeGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorEmployeeGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
