import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaloOaComponent } from './zalo-oa.component';

describe('ZaloOaComponent', () => {
  let component: ZaloOaComponent;
  let fixture: ComponentFixture<ZaloOaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaloOaComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaloOaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
