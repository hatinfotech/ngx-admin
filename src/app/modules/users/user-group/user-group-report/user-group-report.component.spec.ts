import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupReportComponent } from './user-group-report.component';

describe('UserGroupReportComponent', () => {
  let component: UserGroupReportComponent;
  let fixture: ComponentFixture<UserGroupReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGroupReportComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
