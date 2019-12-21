import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrMenuListComponent } from './ivr-menu-list.component';

describe('IvrMenuListComponent', () => {
  let component: IvrMenuListComponent;
  let fixture: ComponentFixture<IvrMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvrMenuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
