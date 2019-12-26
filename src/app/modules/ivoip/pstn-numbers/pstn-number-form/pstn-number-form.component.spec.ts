import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PstnNumberFormComponent } from './pstn-number-form.component';

describe('PstnNumberFormComponent', () => {
  let component: PstnNumberFormComponent;
  let fixture: ComponentFixture<PstnNumberFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PstnNumberFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PstnNumberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
