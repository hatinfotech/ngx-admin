import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesProductListComponent } from './sales-product-list.component';

describe('SalesProductListComponent', () => {
  let component: SalesProductListComponent;
  let fixture: ComponentFixture<SalesProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesProductListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
