import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PstnNumbersComponent } from './pstn-numbers.component';

describe('PstnNumbersComponent', () => {
  let component: PstnNumbersComponent;
  let fixture: ComponentFixture<PstnNumbersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PstnNumbersComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PstnNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
