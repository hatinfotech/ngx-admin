import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommerceServiceByCycleListComponent } from './commerce-service-by-cycle-list.component';

describe('CommerceServiceByCycleListComponent', () => {
  let component: CommerceServiceByCycleListComponent;
  let fixture: ComponentFixture<CommerceServiceByCycleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommerceServiceByCycleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommerceServiceByCycleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
