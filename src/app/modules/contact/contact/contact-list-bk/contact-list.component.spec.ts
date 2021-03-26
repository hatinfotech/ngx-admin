import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListBkComponent } from './contact-list.component';

describe('ContactListComponent', () => {
  let component: ContactListBkComponent;
  let fixture: ComponentFixture<ContactListBkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactListBkComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListBkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
