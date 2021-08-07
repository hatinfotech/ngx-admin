import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRemovedListComponent } from './contact-removed-list.component';

describe('ContactRemovedListComponent', () => {
  let component: ContactRemovedListComponent;
  let fixture: ComponentFixture<ContactRemovedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactRemovedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRemovedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
