import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTimeLineViewComponent } from './work-time-line-view.component';

describe('WorkTimeLineContainerComponent', () => {
  let component: WorkTimeLineViewComponent;
  let fixture: ComponentFixture<WorkTimeLineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTimeLineViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTimeLineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
