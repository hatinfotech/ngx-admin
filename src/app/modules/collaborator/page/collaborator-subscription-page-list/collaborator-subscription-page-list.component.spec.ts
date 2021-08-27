import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorSubscriptionPageListComponent } from './collaborator-subscription-page-list.component';


describe('CollaboratorPageListComponent', () => {
  let component: CollaboratorSubscriptionPageListComponent;
  let fixture: ComponentFixture<CollaboratorSubscriptionPageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorSubscriptionPageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorSubscriptionPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
