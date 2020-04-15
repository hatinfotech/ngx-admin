import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsCodeListComponent } from './ads-code-list.component';

describe('AdsCodeListComponent', () => {
  let component: AdsCodeListComponent;
  let fixture: ComponentFixture<AdsCodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsCodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
