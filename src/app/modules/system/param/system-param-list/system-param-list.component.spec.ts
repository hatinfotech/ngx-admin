import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParamListComponent } from './system-param-list.component';

describe('SystemParamListComponent', () => {
  let component: SystemParamListComponent;
  let fixture: ComponentFixture<SystemParamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParamListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
