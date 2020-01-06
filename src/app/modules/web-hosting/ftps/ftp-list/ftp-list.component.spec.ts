import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpListComponent } from './ftp-list.component';

describe('FtpListComponent', () => {
  let component: FtpListComponent;
  let fixture: ComponentFixture<FtpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtpListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
