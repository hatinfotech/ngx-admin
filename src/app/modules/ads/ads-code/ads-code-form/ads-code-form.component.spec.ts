import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsCodeFormComponent } from './ads-code-form.component';

describe('AdsCodeFormComponent', () => {
  let component: AdsCodeFormComponent;
  let fixture: ComponentFixture<AdsCodeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsCodeFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
