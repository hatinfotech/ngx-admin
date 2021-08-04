import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccMasterBookListComponent } from './acc-master-book-list.component';

describe('AccMasterBookListComponent', () => {
  let component: AccMasterBookListComponent;
  let fixture: ComponentFixture<AccMasterBookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccMasterBookListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccMasterBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
