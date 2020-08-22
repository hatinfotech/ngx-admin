import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaloOaFollowerListComponent } from './zalo-oa-follower-list.component';

describe('ZaloOaFollowerListComponent', () => {
  let component: ZaloOaFollowerListComponent;
  let fixture: ComponentFixture<ZaloOaFollowerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaloOaFollowerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaloOaFollowerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
