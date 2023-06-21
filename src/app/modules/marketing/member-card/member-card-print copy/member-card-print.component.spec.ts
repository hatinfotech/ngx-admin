import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktMemberCardPrintComponent } from './member-card-print.component';

describe('MktMemberCardPrintComponent', () => {
  let component: MktMemberCardPrintComponent;
  let fixture: ComponentFixture<MktMemberCardPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktMemberCardPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktMemberCardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
