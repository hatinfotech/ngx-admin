import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressOrderListComponent } from './order-list.component';

describe('WordpressOrderListComponent', () => {
  let component: WordpressOrderListComponent;
  let fixture: ComponentFixture<WordpressOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressOrderListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
