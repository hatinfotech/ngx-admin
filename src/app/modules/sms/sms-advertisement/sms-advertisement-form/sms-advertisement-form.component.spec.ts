import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsAdvertisementFormComponent } from './sms-advertisement-form.component';

describe('SmsAdvertisementFormComponent', () => {
  let component: SmsAdvertisementFormComponent;
  let fixture: ComponentFixture<SmsAdvertisementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsAdvertisementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsAdvertisementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
