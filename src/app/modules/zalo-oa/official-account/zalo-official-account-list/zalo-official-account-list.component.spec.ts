import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaloOfficialAccountListComponent } from './zalo-official-account-list.component';

describe('ZaloOfficialAccountListComponent', () => {
  let component: ZaloOfficialAccountListComponent;
  let fixture: ComponentFixture<ZaloOfficialAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaloOfficialAccountListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaloOfficialAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
