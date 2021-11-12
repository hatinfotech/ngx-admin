import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorEducationArticleFormComponent } from './collaborator-education-article-form.component';


describe('PurchaseVoucherFormComponent', () => {
  let component: CollaboratorEducationArticleFormComponent;
  let fixture: ComponentFixture<CollaboratorEducationArticleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorEducationArticleFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorEducationArticleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
