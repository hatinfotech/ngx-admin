import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbxFormComponent } from './pbx-form.component';

describe('PbxFormComponent', () => {
  let component: PbxFormComponent;
  let fixture: ComponentFixture<PbxFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbxFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
