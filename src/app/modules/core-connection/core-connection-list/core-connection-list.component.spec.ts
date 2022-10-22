import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreConnectionListComponent } from './core-connection-list.component';

describe('CoreConnectionListComponent', () => {
  let component: CoreConnectionListComponent;
  let fixture: ComponentFixture<CoreConnectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreConnectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
