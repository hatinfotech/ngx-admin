import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaloOaFollowerFormComponent } from './zalo-oa-follower-form.component';

describe('ZaloOaFollowerFormComponent', () => {
  let component: ZaloOaFollowerFormComponent;
  let fixture: ComponentFixture<ZaloOaFollowerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaloOaFollowerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaloOaFollowerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
