import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesViewerComponent } from './images-viewer.component';

describe('ImagesViewerComponent', () => {
  let component: ImagesViewerComponent;
  let fixture: ComponentFixture<ImagesViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
