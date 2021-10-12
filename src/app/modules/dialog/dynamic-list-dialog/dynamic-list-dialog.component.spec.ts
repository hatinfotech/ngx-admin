import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicListDialogComponent } from './dynamic-list-dialog.component';

describe('DynamicListDialogComponent', () => {
  let component: DynamicListDialogComponent;
  let fixture: ComponentFixture<DynamicListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
