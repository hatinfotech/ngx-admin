import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorSellerListComponent } from './collaborator-seller-list.component';

describe('EmployeeListComponent', () => {
  let component: CollaboratorSellerListComponent;
  let fixture: ComponentFixture<CollaboratorSellerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorSellerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorSellerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
