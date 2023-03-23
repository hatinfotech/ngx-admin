import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressPosOrderFormComponent } from './order-form.component';

describe('WpPosOrderFormComponent', () => {
  let component: WordpressPosOrderFormComponent;
  let fixture: ComponentFixture<WordpressPosOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressPosOrderFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressPosOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
