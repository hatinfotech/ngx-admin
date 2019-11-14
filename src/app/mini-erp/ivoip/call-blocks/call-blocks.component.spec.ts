import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallBlocksComponent } from './call-blocks.component';

describe('CallBlocksComponent', () => {
  let component: CallBlocksComponent;
  let fixture: ComponentFixture<CallBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
