import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorProductListComponent } from './collaborator-product-list.component';

describe('CollaboratorProductListComponent', () => {
  let component: CollaboratorProductListComponent;
  let fixture: ComponentFixture<CollaboratorProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
