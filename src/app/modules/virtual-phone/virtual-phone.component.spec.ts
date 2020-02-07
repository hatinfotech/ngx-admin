import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualPhoneComponent } from './virtual-phone.component';

describe('VirtualPhoneComponent', () => {
  let component: VirtualPhoneComponent;
  let fixture: ComponentFixture<VirtualPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualPhoneComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
