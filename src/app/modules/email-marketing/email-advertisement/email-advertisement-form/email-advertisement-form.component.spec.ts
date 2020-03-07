import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAdvertisementFormComponent } from './email-advertisement-form.component';

describe('EmailAdvertisementFormComponent', () => {
  let component: EmailAdvertisementFormComponent;
  let fixture: ComponentFixture<EmailAdvertisementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAdvertisementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAdvertisementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
