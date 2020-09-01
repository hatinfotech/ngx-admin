import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseBookCommitComponent } from './warehouse-book-commit.component';

describe('WarehouseBookCommitComponent', () => {
  let component: WarehouseBookCommitComponent;
  let fixture: ComponentFixture<WarehouseBookCommitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseBookCommitComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseBookCommitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
