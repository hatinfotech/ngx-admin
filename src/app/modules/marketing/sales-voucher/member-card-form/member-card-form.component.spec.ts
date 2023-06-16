import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktMemberCardFormComponent } from './member-card-form.component';

describe('MktMemberCardFormComponent', () => {
  let component: MktMemberCardFormComponent;
  let fixture: ComponentFixture<MktMemberCardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktMemberCardFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktMemberCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
