import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommerceServiceByCycleFormComponent } from './commerce-service-by-cycle-form.component';

describe('CommerceServiceByCycleFormComponent', () => {
  let component: CommerceServiceByCycleFormComponent;
  let fixture: ComponentFixture<CommerceServiceByCycleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommerceServiceByCycleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommerceServiceByCycleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
