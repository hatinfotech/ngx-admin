/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FilesInputComponent } from './files-input.component';

describe('FilesInputComponent', () => {
  let component: FilesInputComponent;
  let fixture: ComponentFixture<FilesInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
