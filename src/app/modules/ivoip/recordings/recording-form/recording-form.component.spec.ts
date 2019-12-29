import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingFormComponent } from './recording-form.component';

describe('RecordingFormComponent', () => {
  let component: RecordingFormComponent;
  let fixture: ComponentFixture<RecordingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
