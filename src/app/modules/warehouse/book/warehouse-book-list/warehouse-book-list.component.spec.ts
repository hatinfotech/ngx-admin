import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseBookListComponent } from './warehouse-book-list.component';

describe('WarehouseBookListComponent', () => {
  let component: WarehouseBookListComponent;
  let fixture: ComponentFixture<WarehouseBookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseBookListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
