import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParameterListComponent } from './system-parameter-list.component';

describe('SystemParameterListComponent', () => {
  let component: SystemParameterListComponent;
  let fixture: ComponentFixture<SystemParameterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParameterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParameterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
