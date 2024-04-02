import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktPromotionProgramFormComponent } from './promotion-program-form.component';

describe('MktPromotionProgramFormComponent', () => {
  let component: MktPromotionProgramFormComponent;
  let fixture: ComponentFixture<MktPromotionProgramFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktPromotionProgramFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktPromotionProgramFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
