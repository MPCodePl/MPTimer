import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTimeLineComponent } from './work-time-line.component';

describe('WorkTimeLineComponent', () => {
  let component: WorkTimeLineComponent;
  let fixture: ComponentFixture<WorkTimeLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkTimeLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
