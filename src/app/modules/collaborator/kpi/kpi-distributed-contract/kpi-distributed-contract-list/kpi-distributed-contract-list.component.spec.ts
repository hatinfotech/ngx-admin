import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiDistributedContractListComponent } from './kpi-distributed-contract-list.component';


describe('CollaboratorKpiDistributedContractListComponent', () => {
  let component: CollaboratorKpiDistributedContractListComponent;
  let fixture: ComponentFixture<CollaboratorKpiDistributedContractListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiDistributedContractListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiDistributedContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
