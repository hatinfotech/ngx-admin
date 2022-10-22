import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreConnectionFormComponent } from './core-connection-form.component';

describe('CoreConnectionFormComponent', () => {
  let component: CoreConnectionFormComponent;
  let fixture: ComponentFixture<CoreConnectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreConnectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
