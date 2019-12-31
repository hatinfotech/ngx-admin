import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseFormComponent } from './database-form.component';

describe('DatabaseFormComponent', () => {
  let component: DatabaseFormComponent;
  let fixture: ComponentFixture<DatabaseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
