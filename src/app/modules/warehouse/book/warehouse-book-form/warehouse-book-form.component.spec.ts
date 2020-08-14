import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseBookFormComponent } from './warehouse-book-form.component';

describe('WarehouseBookFormComponent', () => {
  let component: WarehouseBookFormComponent;
  let fixture: ComponentFixture<WarehouseBookFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseBookFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
