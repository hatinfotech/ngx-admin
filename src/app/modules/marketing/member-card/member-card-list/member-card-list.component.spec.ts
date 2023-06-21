import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktMemberCardListComponent } from './member-card-list.component';

describe('MktMemberCardListComponent', () => {
  let component: MktMemberCardListComponent;
  let fixture: ComponentFixture<MktMemberCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktMemberCardListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktMemberCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
