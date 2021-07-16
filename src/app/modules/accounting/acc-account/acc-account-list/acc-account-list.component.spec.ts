import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccAccountListComponent } from './acc-account-list.component';

describe('AccAccountListComponent', () => {
  let component: AccAccountListComponent;
  let fixture: ComponentFixture<AccAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
