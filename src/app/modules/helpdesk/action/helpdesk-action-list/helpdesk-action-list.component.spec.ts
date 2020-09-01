import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskActionListComponent } from './helpdesk-action-list.component';

describe('HelpdeskActionListComponent', () => {
  let component: HelpdeskActionListComponent;
  let fixture: ComponentFixture<HelpdeskActionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskActionListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
