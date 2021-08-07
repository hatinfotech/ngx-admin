import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEmployeeListComponent } from './contact-employee-list.component';

describe('EmployeeListComponent', () => {
  let component: ContactEmployeeListComponent;
  let fixture: ComponentFixture<ContactEmployeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactEmployeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
