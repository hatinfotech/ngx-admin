import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsAdvertisementListComponent } from './sms-advertisement-list.component';

describe('SmsAdvertisementListComponent', () => {
  let component: SmsAdvertisementListComponent;
  let fixture: ComponentFixture<SmsAdvertisementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsAdvertisementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsAdvertisementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
