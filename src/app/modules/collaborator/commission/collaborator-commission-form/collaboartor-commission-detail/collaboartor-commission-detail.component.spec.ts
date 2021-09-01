import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboartorCommissionDetailComponent } from './collaboartor-commission-detail.component';

describe('CollaboartorCommissionDetailComponent', () => {
  let component: CollaboartorCommissionDetailComponent;
  let fixture: ComponentFixture<CollaboartorCommissionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboartorCommissionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboartorCommissionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
