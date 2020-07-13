import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvoipComponent } from './ivoip.component';

describe('IvoipComponent', () => {
  let component: IvoipComponent;
  let fixture: ComponentFixture<IvoipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvoipComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvoipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
