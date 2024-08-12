import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartUsingPageComponent } from './start-using-page.component';
import { MockProvider } from 'ng-mocks';
import { MsalService } from '@azure/msal-angular';

describe('StartUsingPageComponent', () => {
  let component: StartUsingPageComponent;
  let fixture: ComponentFixture<StartUsingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartUsingPageComponent],
      providers: [MockProvider(MsalService)],
    }).compileComponents();

    fixture = TestBed.createComponent(StartUsingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
