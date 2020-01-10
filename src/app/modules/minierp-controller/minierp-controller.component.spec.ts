import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinierpControllerComponent } from './minierp-controller.component';

describe('MinierpControllerComponent', () => {
  let component: MinierpControllerComponent;
  let fixture: ComponentFixture<MinierpControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinierpControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinierpControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
