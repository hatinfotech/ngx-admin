import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterAuthorizedKeyFormComponent } from './cluster-authorized-key-form.component';

describe('ClusterAuthorizedKeyFormComponent', () => {
  let component: ClusterAuthorizedKeyFormComponent;
  let fixture: ComponentFixture<ClusterAuthorizedKeyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterAuthorizedKeyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterAuthorizedKeyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
