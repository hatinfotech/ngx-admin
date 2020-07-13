import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsContentFormComponent } from './ads-content-form.component';

describe('AdsContentFormComponent', () => {
  let component: AdsContentFormComponent;
  let fixture: ComponentFixture<AdsContentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsContentFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsContentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
