import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktPromotionProgramPrintComponent } from './promotion-program-print.component';

describe('MktPromotionProgramPrintComponent', () => {
  let component: MktPromotionProgramPrintComponent;
  let fixture: ComponentFixture<MktPromotionProgramPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktPromotionProgramPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktPromotionProgramPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
