import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialplanFormComponent } from './dialplan-form.component';

describe('DialplanFormComponent', () => {
  let component: DialplanFormComponent;
  let fixture: ComponentFixture<DialplanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialplanFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialplanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
