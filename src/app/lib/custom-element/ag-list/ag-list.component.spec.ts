import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgListComponent } from './ag-list.component';

describe('AgListComponent', () => {
  let component: AgListComponent;
  let fixture: ComponentFixture<AgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
