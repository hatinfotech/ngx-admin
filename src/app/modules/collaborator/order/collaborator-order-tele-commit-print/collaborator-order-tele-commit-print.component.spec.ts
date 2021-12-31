import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorOrderTeleCommitPrintComponent } from './collaborator-order-tele-commit-print.component';


describe('SalesPriceReportPrintComponent', () => {
  let component: CollaboratorOrderTeleCommitPrintComponent;
  let fixture: ComponentFixture<CollaboratorOrderTeleCommitPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorOrderTeleCommitPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorOrderTeleCommitPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
