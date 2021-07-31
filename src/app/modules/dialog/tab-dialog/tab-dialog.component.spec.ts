import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDialogComponent } from './tab-dialog.component';

describe('TabDialogComponent', () => {
  let component: TabDialogComponent;
  let fixture: ComponentFixture<TabDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
