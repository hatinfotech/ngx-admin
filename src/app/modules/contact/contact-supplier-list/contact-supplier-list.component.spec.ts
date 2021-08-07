import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSupplierListComponent } from './contact-supplier-list.component';

describe('SupplierListComponent', () => {
  let component: ContactSupplierListComponent;
  let fixture: ComponentFixture<ContactSupplierListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSupplierListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
