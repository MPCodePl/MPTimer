import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkTimeUiComponent } from './work-time-ui.component';

describe('WorkTimeUiComponent', () => {
  let component: WorkTimeUiComponent;
  let fixture: ComponentFixture<WorkTimeUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkTimeUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkTimeUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
