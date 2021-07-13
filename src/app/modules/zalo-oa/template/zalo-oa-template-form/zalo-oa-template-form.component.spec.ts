import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaloOaTemplateFormComponent } from './zalo-oa-template-form.component';

describe('ZaloOaTemplateFormComponent', () => {
  let component: ZaloOaTemplateFormComponent;
  let fixture: ComponentFixture<ZaloOaTemplateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaloOaTemplateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaloOaTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
