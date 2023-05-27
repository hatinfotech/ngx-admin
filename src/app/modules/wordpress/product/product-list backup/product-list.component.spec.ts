import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressProductListComponent } from './product-list.component';

describe('WordpressProductListComponent', () => {
  let component: WordpressProductListComponent;
  let fixture: ComponentFixture<WordpressProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
