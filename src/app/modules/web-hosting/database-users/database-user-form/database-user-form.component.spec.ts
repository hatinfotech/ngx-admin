import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseUserFormComponent } from './database-user-form.component';

describe('DatabaseUserFormComponent', () => {
  let component: DatabaseUserFormComponent;
  let fixture: ComponentFixture<DatabaseUserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseUserFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
