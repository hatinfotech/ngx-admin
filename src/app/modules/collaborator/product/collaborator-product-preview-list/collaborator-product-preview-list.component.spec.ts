import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorProductPreviewListComponent } from './collaborator-product-preview-list.component';

describe('CollaboratorProductPreviewListComponent', () => {
  let component: CollaboratorProductPreviewListComponent;
  let fixture: ComponentFixture<CollaboratorProductPreviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorProductPreviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorProductPreviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
