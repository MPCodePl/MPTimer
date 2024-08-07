import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackofficeAppHeaderSmartComponent } from './backoffice-app-header-smart.component';

describe('BackofficeAppHeaderSmartComponent', () => {
  let component: BackofficeAppHeaderSmartComponent;
  let fixture: ComponentFixture<BackofficeAppHeaderSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeAppHeaderSmartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackofficeAppHeaderSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
