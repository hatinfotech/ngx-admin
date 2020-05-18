import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAdvertisementListComponent } from './email-advertisement-list.component';

describe('EmailAdvertisementListComponent', () => {
  let component: EmailAdvertisementListComponent;
  let fixture: ComponentFixture<EmailAdvertisementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAdvertisementListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAdvertisementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
