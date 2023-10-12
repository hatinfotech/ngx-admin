import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysParameterListComponent } from './parameter-list.component';

describe('SystemParameterListComponent', () => {
  let component: SysParameterListComponent;
  let fixture: ComponentFixture<SysParameterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysParameterListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysParameterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
