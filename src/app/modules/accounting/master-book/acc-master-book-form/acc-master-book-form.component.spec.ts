import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccMasterBookFormComponent } from './acc-master-book-form.component';

describe('AccMasterBookFormComponent', () => {
  let component: AccMasterBookFormComponent;
  let fixture: ComponentFixture<AccMasterBookFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccMasterBookFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccMasterBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
