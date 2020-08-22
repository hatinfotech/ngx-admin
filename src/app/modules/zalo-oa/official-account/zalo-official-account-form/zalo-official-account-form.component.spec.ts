import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaloOfficialAccountFormComponent } from './zalo-official-account-form.component';

describe('ZaloOfficialAccountFormComponent', () => {
  let component: ZaloOfficialAccountFormComponent;
  let fixture: ComponentFixture<ZaloOfficialAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaloOfficialAccountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaloOfficialAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
