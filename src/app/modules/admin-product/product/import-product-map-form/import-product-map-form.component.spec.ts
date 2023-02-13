import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProductMapFormComponent } from './import-product-map-form.component';

describe('ImportProductMapFormComponent', () => {
  let component: ImportProductMapFormComponent;
  let fixture: ComponentFixture<ImportProductMapFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportProductMapFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProductMapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
