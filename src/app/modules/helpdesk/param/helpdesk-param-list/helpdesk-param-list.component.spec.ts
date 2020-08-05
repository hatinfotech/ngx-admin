import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskParamListComponent } from './helpdesk-param-list.component';

describe('HelpdeskParamListComponent', () => {
  let component: HelpdeskParamListComponent;
  let fixture: ComponentFixture<HelpdeskParamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskParamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskParamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
