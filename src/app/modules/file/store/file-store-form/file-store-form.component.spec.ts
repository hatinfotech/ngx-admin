import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStoreFormComponent } from './file-store-form.component';

describe('FileStoreFormComponent', () => {
  let component: FileStoreFormComponent;
  let fixture: ComponentFixture<FileStoreFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileStoreFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileStoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
