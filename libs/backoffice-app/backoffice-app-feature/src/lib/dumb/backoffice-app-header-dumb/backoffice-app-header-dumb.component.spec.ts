import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackofficeAppHeaderDumbComponent } from './backoffice-app-header-dumb.component';

describe('BackofficeAppHeaderDumbComponent', () => {
  let component: BackofficeAppHeaderDumbComponent;
  let fixture: ComponentFixture<BackofficeAppHeaderDumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeAppHeaderDumbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackofficeAppHeaderDumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
