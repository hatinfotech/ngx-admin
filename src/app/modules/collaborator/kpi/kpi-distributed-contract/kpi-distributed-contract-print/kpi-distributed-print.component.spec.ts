import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorKpiDistributedContractPrintComponent } from './kpi-distributed-print.component';


describe('CollaboratorKpiDistributedContractPrintComponent', () => {
  let component: CollaboratorKpiDistributedContractPrintComponent;
  let fixture: ComponentFixture<CollaboratorKpiDistributedContractPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorKpiDistributedContractPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorKpiDistributedContractPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
