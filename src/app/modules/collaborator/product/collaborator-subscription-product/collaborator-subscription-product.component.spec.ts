import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorSubscriptionProductComponent } from './collaborator-subscription-product.component';

describe('CollaboratorProductSubscriptionComponent', () => {
  let component: CollaboratorSubscriptionProductComponent;
  let fixture: ComponentFixture<CollaboratorSubscriptionProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorSubscriptionProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorSubscriptionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
