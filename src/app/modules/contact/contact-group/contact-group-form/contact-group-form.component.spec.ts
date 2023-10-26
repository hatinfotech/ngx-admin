import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactGroupFormComponent } from './contact-group-form.component';

describe('ContactGroupFormComponent', () => {
  let component: ContactGroupFormComponent;
  let fixture: ComponentFixture<ContactGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
