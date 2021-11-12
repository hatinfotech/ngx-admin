import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorEducationArticleListComponent } from './collaborator-education-article-list.component';


describe('PurchaseVoucherListComponent', () => {
  let component: CollaboratorEducationArticleListComponent;
  let fixture: ComponentFixture<CollaboratorEducationArticleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorEducationArticleListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorEducationArticleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
