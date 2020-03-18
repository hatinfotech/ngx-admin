import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncFormComponent } from './sync-form.component';

describe('SyncFormComponent', () => {
  let component: SyncFormComponent;
  let fixture: ComponentFixture<SyncFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
