import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackofficeAppLayoutSmartComponent } from './backoffice-app-layout-smart.component';
import { provideRouter } from '@angular/router';

describe('BackofficeAppLayoutSmartComponent', () => {
  let component: BackofficeAppLayoutSmartComponent;
  let fixture: ComponentFixture<BackofficeAppLayoutSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeAppLayoutSmartComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BackofficeAppLayoutSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
