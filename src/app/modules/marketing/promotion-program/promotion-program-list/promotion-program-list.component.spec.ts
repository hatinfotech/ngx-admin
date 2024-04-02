import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktPromotionProgramListComponent } from './promotion-program-list.component';

describe('MktPromotionProgramListComponent', () => {
  let component: MktPromotionProgramListComponent;
  let fixture: ComponentFixture<MktPromotionProgramListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktPromotionProgramListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktPromotionProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
