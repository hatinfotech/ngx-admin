import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialplanListComponent } from './dialplan-list.component';

describe('DialplanListComponent', () => {
  let component: DialplanListComponent;
  let fixture: ComponentFixture<DialplanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialplanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialplanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
