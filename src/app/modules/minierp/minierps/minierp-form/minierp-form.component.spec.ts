import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinierpFormComponent } from './minierp-form.component';

describe('MinierpFormComponent', () => {
  let component: MinierpFormComponent;
  let fixture: ComponentFixture<MinierpFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinierpFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinierpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
