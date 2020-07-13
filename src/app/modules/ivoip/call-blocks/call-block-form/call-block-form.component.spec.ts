import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallBlockFormComponent } from './call-block-form.component';

describe('CallBlockFormComponent', () => {
  let component: CallBlockFormComponent;
  let fixture: ComponentFixture<CallBlockFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallBlockFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallBlockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
