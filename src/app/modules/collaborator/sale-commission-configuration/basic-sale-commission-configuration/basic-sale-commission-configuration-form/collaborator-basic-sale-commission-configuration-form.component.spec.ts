import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorBasicSaleCommissionConfigurationFormComponent } from './collaborator-basic-sale-commission-configuration-form.component';


describe('CollaboratorBasicSaleCommissionConfigurationFormComponent', () => {
  let component: CollaboratorBasicSaleCommissionConfigurationFormComponent;
  let fixture: ComponentFixture<CollaboratorBasicSaleCommissionConfigurationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorBasicSaleCommissionConfigurationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorBasicSaleCommissionConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
