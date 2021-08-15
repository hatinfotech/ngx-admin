import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterAuthorizedKeyListComponent } from './cluster-authorized-key-list.component';

describe('ClusterAuthorizedKeyListComponent', () => {
  let component: ClusterAuthorizedKeyListComponent;
  let fixture: ComponentFixture<ClusterAuthorizedKeyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterAuthorizedKeyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterAuthorizedKeyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
