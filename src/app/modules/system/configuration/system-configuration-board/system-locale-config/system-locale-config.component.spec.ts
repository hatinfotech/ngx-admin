import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLocaleConfigComponent } from './system-locale-config.component';

describe('SystemLocaleConfigComponent', () => {
  let component: SystemLocaleConfigComponent;
  let fixture: ComponentFixture<SystemLocaleConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemLocaleConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLocaleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
