import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressOrderFormComponent } from './order-form.component';

describe('WordpressOrderFormComponent', () => {
  let component: WordpressOrderFormComponent;
  let fixture: ComponentFixture<WordpressOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressOrderFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
