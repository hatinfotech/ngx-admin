import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaloOaTemplateListComponent } from './zalo-oa-template-list.component';

describe('ZaloOaTemplateListComponent', () => {
  let component: ZaloOaTemplateListComponent;
  let fixture: ComponentFixture<ZaloOaTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZaloOaTemplateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaloOaTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
