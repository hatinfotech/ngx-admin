import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PstnNumberListComponent } from './pstn-number-list.component';

describe('PstnNumberListComponent', () => {
  let component: PstnNumberListComponent;
  let fixture: ComponentFixture<PstnNumberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PstnNumberListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PstnNumberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
