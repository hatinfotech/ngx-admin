import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseUserListComponent } from './database-user-list.component';

describe('DatabaseUserListComponent', () => {
  let component: DatabaseUserListComponent;
  let fixture: ComponentFixture<DatabaseUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
