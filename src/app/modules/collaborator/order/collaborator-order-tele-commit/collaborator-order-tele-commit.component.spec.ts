import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorOrderTeleCommitFormComponent } from './collaborator-order-tele-commit.component';

describe('CollaboratorOrderTeleCommitFormComponent', () => {
  let component: CollaboratorOrderTeleCommitFormComponent;
  let fixture: ComponentFixture<CollaboratorOrderTeleCommitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorOrderTeleCommitFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorOrderTeleCommitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
