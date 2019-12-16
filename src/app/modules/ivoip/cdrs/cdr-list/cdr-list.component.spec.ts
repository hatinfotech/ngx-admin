import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdrListComponent } from './cdr-list.component';

describe('CdrListComponent', () => {
  let component: CdrListComponent;
  let fixture: ComponentFixture<CdrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
