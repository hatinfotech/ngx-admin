import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboartorAwardDetailComponent } from './collaboartor-award-detail.component';

describe('CollaboartorAwardDetailComponent', () => {
  let component: CollaboartorAwardDetailComponent;
  let fixture: ComponentFixture<CollaboartorAwardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboartorAwardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboartorAwardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
