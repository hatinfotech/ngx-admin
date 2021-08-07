import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCustomerListComponent } from './contact-customer-list.component';

describe('CustomerListComponent', () => {
  let component: ContactCustomerListComponent;
  let fixture: ComponentFixture<ContactCustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCustomerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
