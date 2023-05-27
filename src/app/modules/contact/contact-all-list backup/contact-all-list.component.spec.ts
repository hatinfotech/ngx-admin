import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAllListComponent } from './contact-all-list.component';

describe('ContactAllListComponent', () => {
  let component: ContactAllListComponent;
  let fixture: ComponentFixture<ContactAllListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAllListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAllListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
