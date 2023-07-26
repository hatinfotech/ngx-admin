import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorEmployeeGroupListComponent } from './employee-group-list.component';

describe('CollaboratorEmployeeGroupListComponent', () => {
  let component: CollaboratorEmployeeGroupListComponent;
  let fixture: ComponentFixture<CollaboratorEmployeeGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorEmployeeGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorEmployeeGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
