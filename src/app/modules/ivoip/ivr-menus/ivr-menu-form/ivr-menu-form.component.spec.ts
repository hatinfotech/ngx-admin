import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrMenuFormComponent } from './ivr-menu-form.component';

describe('IvrMenuFormComponent', () => {
  let component: IvrMenuFormComponent;
  let fixture: ComponentFixture<IvrMenuFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvrMenuFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrMenuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
