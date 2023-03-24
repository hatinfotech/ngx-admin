import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressOrderPrintComponent } from './order-print.component';

describe('WordpressOrderPrintComponent', () => {
  let component: WordpressOrderPrintComponent;
  let fixture: ComponentFixture<WordpressOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressOrderPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
