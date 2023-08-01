import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiDistributedContractFormComponent } from './kpi-distributed-contract-form.component';


describe('CollaboratorKpiDistributedContractFormComponent', () => {
  let component: CollaboratorKpiDistributedContractFormComponent;
  let fixture: ComponentFixture<CollaboratorKpiDistributedContractFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiDistributedContractFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiDistributedContractFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
