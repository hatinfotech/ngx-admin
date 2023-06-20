import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorOrderListComponent } from './collaborator-order-list.component';

describe('CollaboratorOrderListComponent', () => {
  let component: CollaboratorOrderListComponent;
  let fixture: ComponentFixture<CollaboratorOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
