import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinierpComponent } from './minierp.component';

describe('MinierpComponent', () => {
  let component: MinierpComponent;
  let fixture: ComponentFixture<MinierpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinierpComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinierpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
