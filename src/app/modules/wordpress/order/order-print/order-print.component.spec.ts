import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressPosOrderPrintComponent } from './order-print.component';

describe('WpPosOrderPrintComponent', () => {
  let component: WordpressPosOrderPrintComponent;
  let fixture: ComponentFixture<WordpressPosOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressPosOrderPrintComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressPosOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
