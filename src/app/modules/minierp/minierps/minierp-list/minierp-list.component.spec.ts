import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinierpListComponent } from './minierp-list.component';

describe('MinierpListComponent', () => {
  let component: MinierpListComponent;
  let fixture: ComponentFixture<MinierpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinierpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinierpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
