import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostingFormComponent } from './hosting-form.component';

describe('HostingFormComponent', () => {
  let component: HostingFormComponent;
  let fixture: ComponentFixture<HostingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostingFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
