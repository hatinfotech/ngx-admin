import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStoreListComponent } from './file-store-list.component';

describe('FileStoreListComponent', () => {
  let component: FileStoreListComponent;
  let fixture: ComponentFixture<FileStoreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileStoreListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileStoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
