import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorEducationArticlePrintComponent } from './collaborator-education-article-print.component';


describe('PurchaseVoucherPrintComponent', () => {
  let component: CollaboratorEducationArticlePrintComponent;
  let fixture: ComponentFixture<CollaboratorEducationArticlePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorEducationArticlePrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorEducationArticlePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
