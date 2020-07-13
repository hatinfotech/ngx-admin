import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallBlockListComponent } from './call-block-list.component';

describe('CallBlockListComponent', () => {
  let component: CallBlockListComponent;
  let fixture: ComponentFixture<CallBlockListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallBlockListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallBlockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
