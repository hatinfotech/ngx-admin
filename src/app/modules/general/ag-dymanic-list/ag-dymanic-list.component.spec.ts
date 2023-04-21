import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgDynamicListComponent } from './ag-dymanic-list.component';

describe('AgDynamicList', () => {
  let component: AgDynamicListComponent<any>;
  let fixture: ComponentFixture<AgDynamicListComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgDynamicListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgDynamicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
