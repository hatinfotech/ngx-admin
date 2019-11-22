import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGrantComponent } from './permission-grant.component';

describe('PermissionGrantComponent', () => {
  let component: PermissionGrantComponent;
  let fixture: ComponentFixture<PermissionGrantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionGrantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
