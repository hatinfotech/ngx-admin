import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressProductFormComponent } from './product-form.component';

describe('WordpressProductFormComponent', () => {
  let component: WordpressProductFormComponent;
  let fixture: ComponentFixture<WordpressProductFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressProductFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
