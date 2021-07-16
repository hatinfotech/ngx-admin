import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccBusinessListComponent } from './acc-business-list.component';

describe('AccBusinessListComponent', () => {
  let component: AccBusinessListComponent;
  let fixture: ComponentFixture<AccBusinessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccBusinessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccBusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
