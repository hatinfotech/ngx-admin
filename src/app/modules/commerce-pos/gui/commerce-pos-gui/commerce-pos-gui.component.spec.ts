import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercePosGuiComponent } from './commerce-pos-gui.component';

describe('CommercePosGuiComponent', () => {
  let component: CommercePosGuiComponent;
  let fixture: ComponentFixture<CommercePosGuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosGuiComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
