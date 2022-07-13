import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercePosDashboardComponent } from './commerce-pos-dashboard.component';


describe('CommercePosDashboardComponent', () => {
  let component: CommercePosDashboardComponent;
  let fixture: ComponentFixture<CommercePosDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercePosDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercePosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
