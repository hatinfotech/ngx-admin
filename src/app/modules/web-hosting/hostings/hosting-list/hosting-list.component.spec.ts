import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostingListComponent } from './hosting-list.component';

describe('HostingListComponent', () => {
  let component: HostingListComponent;
  let fixture: ComponentFixture<HostingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostingListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
