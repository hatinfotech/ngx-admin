import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniErpComponent } from './mini-erp.component';

describe('MiniErpComponent', () => {
  let component: MiniErpComponent;
  let fixture: ComponentFixture<MiniErpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniErpComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniErpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
