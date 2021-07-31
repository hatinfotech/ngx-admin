import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceChoosingDialogComponent } from './reference-choosing-dialog.component';

describe('TabDialogComponent', () => {
  let component: ReferenceChoosingDialogComponent;
  let fixture: ComponentFixture<ReferenceChoosingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceChoosingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceChoosingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
