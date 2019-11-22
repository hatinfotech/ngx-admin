import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalDialogComponent } from './normal-dialog.component';

describe('NormalDialogComponent', () => {
  let component: NormalDialogComponent;
  let fixture: ComponentFixture<NormalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
