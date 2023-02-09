import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProductDialogComponent } from './import-products-dialog.component';

describe('ImportProductDialogComponent', () => {
  let component: ImportProductDialogComponent;
  let fixture: ComponentFixture<ImportProductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportProductDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
