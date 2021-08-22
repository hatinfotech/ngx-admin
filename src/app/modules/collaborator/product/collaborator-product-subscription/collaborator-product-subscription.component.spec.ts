import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorProductSubscriptionComponent } from './collaborator-product-subscription.component';

describe('CollaboratorProductSubscriptionComponent', () => {
  let component: CollaboratorProductSubscriptionComponent;
  let fixture: ComponentFixture<CollaboratorProductSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorProductSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorProductSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
