import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressPosOrderListComponent } from './order-list.component';

describe('WpPosOrderListComponent', () => {
  let component: WordpressPosOrderListComponent;
  let fixture: ComponentFixture<WordpressPosOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressPosOrderListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressPosOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
